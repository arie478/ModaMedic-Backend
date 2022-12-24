

let StepsMetric = require('./Metrics').StepsMetric;
let DistanceMetric = require('./Metrics').DistanceMetric;
let CaloriesMetric = require('./Metrics').CaloriesMetric;
let User = require('./User');
let Group = require('./Group');

//http://localhost:8180/auth/doctors/comperePatients/getDistanceCompere?start_time=150000000000&end_time=1685413707000&filter="BMI"&groupId=BMI 18.5-25
module.exports.calculateGroupsData=async function () {
    console.log("enter calculateGroupsData");
   var realNow = new Date().setHours(0,0,0,0);
    var start = new Date().setHours(-24,0,0,0);
  //  var realNow =1585413706123;
   // var start = 1585413706160;
    let groups= await Group.getAllGroups();
    for (let i=0; i<groups.length;i++) {
        let users = await findAllUsersIdsInGroup(groups[i]);
        let ids =[];
        for (let j = 0; j < users.length; j++) {
            ids.push(users[j].UserID);
        }
        if (ids.length > 0) {
            //distance
            let docsDistance = await DistanceMetric.find({
                UserID: {$in: ids},
                ValidTime: {$gte: start, $lte: realNow}
            }).lean().exec();
            if (docsDistance.length > 0) {
                let averageDistance = findAverage(docsDistance);
                let newMetricDistance = new DistanceMetric({
                    UserID: groups[i].groupId,
                    Timestamp: realNow,
                    ValidTime: start,
                    Data: averageDistance
                });

                await newMetricDistance.save(function (err, metric) {
                    if (err) return console.error(err);
                    console.log(metric.UserID + " group saved in collection.");
                });
            }
            //steps
            let docsSteps = await StepsMetric.find({
                UserID: {$in: ids},
                ValidTime: {$gte: start, $lte: realNow}
            }).lean().exec();

            if (docsSteps.length > 0) {
                let averageSteps = findAverage(docsSteps);
                let newMetricSteps = new StepsMetric({
                    UserID: groups[i].groupId,
                    Timestamp: realNow,
                    ValidTime: start,
                    Data: averageSteps
                });

                await newMetricSteps.save(function (err, metric) {
                    if (err) return console.error(err);
                    console.log(metric.UserID + " group saved in collection.");
                });
            }
            //Calories
            let docsCalories = await CaloriesMetric.find({
                UserID: {$in: ids},
                ValidTime: {$gte: start, $lte: realNow}
            }).lean().exec();
            if (docsCalories.length > 0) {
                let averageCalories = findAverage(docsCalories);
                let newMetricCalories = new CaloriesMetric({
                    UserID: groups[i].groupId,
                    Timestamp: realNow,
                    ValidTime: start,
                    Data: averageCalories
                });

                await newMetricCalories.save(function (err, metric) {
                    if (err) return console.error(err);
                    console.log(metric.UserID + " group saved in collection.");
                });

            }
        }
    }
    }

async function findAllUsersIdsInGroup(group){
    console.log("enter findAllUsersIdsInGroup");
    let isBeforeSurgery;
    if (group.groupId.endsWith("Before")) isBeforeSurgery=true;
    else isBeforeSurgery=false;

    let filterName=group.filter.filterName;
    let filterValue=group.filter.filterValue;
    if (filterName=="BMI"){

             let min=filterValue.substr(0,filterValue.indexOf('-'));
             if (min =="") // bmi 40+
             {
                 min=40;
                 if (isBeforeSurgery)
                     return await User.find( {BMI_NUMBER: {$gte: parseFloat(min)},$or: [{"DateOfSurgery":{$gte:new Date().getTime()}},{"DateOfSurgery":{$eq:0}}]});
                 else
                     return await User.find( {BMI_NUMBER: {$gte: parseFloat(min)},"DateOfSurgery":{$lt:new Date().getTime()}});
             }
             let max=filterValue.substring(filterValue.indexOf('-')+1);


        if (isBeforeSurgery)
        return await User.find( {BMI_NUMBER: {$gte: parseFloat(min), $lte:parseFloat(max)},$or: [{"DateOfSurgery":{$gte:new Date().getTime()}},{"DateOfSurgery":{$eq:0}}]});
        else{
            let daysAfter=findHowManyDaysAfter(group.groupId);
            if (daysAfter[0]=="") //in case after 180 days +
                return await User.find( {BMI_NUMBER: {$gte: parseFloat(min), $lte:parseFloat(max)},"DateOfSurgery":{$lt:new Date().getTime()-daysAfter[1]*24*60*60*1000,$gt:0}});
            else
            return await User.find( {BMI_NUMBER: {$gte: parseFloat(min), $lte:parseFloat(max)},"DateOfSurgery":{$lt:new Date().getTime()-daysAfter[0]*24*60*60*1000,$gt:new Date().getTime()-daysAfter[1]*24*60*60*1000 }});

        }
    }

    if (isBeforeSurgery)
    return await User.find({[filterName]:[filterValue], $or: [{"DateOfSurgery":{$gte:new Date().getTime()}},{"DateOfSurgery":{$eq:0}}]}).lean().exec();
    else{
        let daysAfter=findHowManyDaysAfter(group.groupId);
        if (daysAfter[0]=="") //in case after 180 days +
            return await User.find({"DateOfSurgery":{$lt:new Date().getTime()-daysAfter[1]*24*60*60*1000,$gt:0},[filterName]:[filterValue]}).lean().exec();
        else
        return await User.find({"DateOfSurgery":{$lt:new Date().getTime()-daysAfter[0]*24*60*60*1000,$gt:new Date().getTime()-daysAfter[1]*24*60*60*1000 },[filterName]:[filterValue]}).lean().exec();

    }
}

function findHowManyDaysAfter(groupId) {
    let range=  groupId.substring(
        groupId.indexOf("/") + 1,
        groupId.lastIndexOf("/")
    );
    let min=range.substr(0,range.indexOf('-'));
    let max=range.substring(range.indexOf('-')+1);
    return [min,max];
}

function findAverage(docs){
    console.log("enter findAverage");
    if (docs.length==0) return 0;
    let sum=0;
    for (let i=0;i<docs.length;i++)
        sum=sum+docs[i].Data;

    return sum/docs.length;

}


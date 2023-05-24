let express = require('express');
let router = express.Router();
let common = require('../common');
let StepsMetric = require('../../modules/Metrics').StepsMetric;
let DistanceMetric = require('../../modules/Metrics').DistanceMetric;
let CaloriesMetric = require('../../modules/Metrics').CaloriesMetric;
let SleepMetric = require('../../modules/Metrics').SleepMetric;
let AccelerometerMetric = require('../../modules/Metrics').AccelerometerMetric;
let WeatherMetric = require('../../modules/Metrics').WeatherMetric;
let ActivityMetric = require('../../modules/Metrics').ActivityMetric;
let User = require('../../modules/User');
let Permission = require('../../modules/Permission');
let service = require('../../service');


let findUsers = async function(firstName, lastName, doctorID){
    let usersID = [];
    const leanDoc = await User.find({First_Name: firstName, Last_Name: lastName, Type:'patient'}).lean().exec();
    for await (const user of leanDoc){
        /**
         let permission = await Permission.findOne({DoctorID: doctorID, PatientID: user.UserID}).lean().exec();
         if(permission)
         usersID.push({UserID: user.UserID, BirthDate: user.BirthDate, Permission: "yes"});
         else
         usersID.push({UserID: user.UserID, BirthDate: user.BirthDate, Permission: "no"});
         **/
        usersID.push(user);
    }
    return usersID;
};

router.get('/getUsers', async function (req, res, next) {
    let allUsers = await User.find({Type: ["patient"]}).lean().exec();
    common(res, null, null, allUsers);
});

router.post('/userId', async function (req, res, next) {
    let userId = service.hashElement(req.body.UserID)
    common(res, null, null, userId);
});

router.get('/getSteps', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);

    let ans = [];
    if (req.query.UserID) {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();
        let docs = await StepsMetric.find({
            UserID: req.query.UserID,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean().exec();
        if (docs.length > 0) {
            let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
            ans.push({UserID: user, docs: onePerDay});
        } else {
            ans.push({UserID: user, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }
    let usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        for await (const user of usersID) {
            //if(user.Permission==="yes") {
            let docs = await StepsMetric.find({
                UserID: user.UserID,
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }).lean().exec();
            if (docs.length > 0) {
                let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                ans.push({UserID: user, docs: onePerDay});
            } else
                ans.push({UserID: user, docs: docs});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getDistance', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    let ans = [];
    if (req.query.UserID) {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();
        let docs = await DistanceMetric.find({
            UserID: req.query.UserID,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean().exec();
        if (docs.length > 0) {
            let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
            ans.push({UserID: user, docs: onePerDay});
        } else {
            ans.push({UserID: user, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }
    let usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        for await (const user of usersID) {
            //if(user.Permission==="yes") {
            let docs = await DistanceMetric.find({
                UserID: user.UserID,
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }).lean().exec();
            if (docs.length > 0) {
                let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                ans.push({UserID: user, docs: onePerDay});
            } else
                ans.push({UserID: user, docs: docs});
            /**
             }
             else
             ans.push({UserID: user.BirthDate, docs: "No Permission"});
             **/
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getCalories', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    let ans = [];
    if (req.query.UserID) {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();
        let docs = await CaloriesMetric.find({
            UserID: req.query.UserID,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean().exec();
        if (docs.length > 0) {
            let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
            ans.push({UserID: user, docs: onePerDay});
        } else {
            ans.push({UserID: user, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }
    let usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length > 0) {
        for await (const user of usersID) {
            //if(user.Permission==="yes") {
            let docs = await CaloriesMetric.find({
                UserID: user.UserID,
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }).lean().exec();
            if (docs.length > 0) {
                let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                ans.push({UserID: user, docs: onePerDay});
            } else {
                ans.push({UserID: user, docs: docs});
            }
            common(res, null, null, ans);
        }
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getSleep', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    let ans = [];
    if (req.query.UserID) {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();
        let docs = await SleepMetric.find({
            UserID: req.query.UserID,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean().exec();
        if (docs.length > 0) {
            let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
            ans.push({UserID: user, docs: onePerDay});
        } else {
            ans.push({UserID: user, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }
    let usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length > 0) {
        for await (const user of usersID) {
            //if(user.Permission==="yes") {
            let docs = await SleepMetric.find({
                UserID: user.UserID,
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }).lean().exec();
            if (docs.length > 0) {
                let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                ans.push({UserID: user, docs: onePerDay});
            } else {
                ans.push({UserID: user, docs: docs});
            }
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getAccelerometer', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    let ans = [];
    if (req.query.UserID) {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();
        let docs = await AccelerometerMetric.find({
            UserID: req.query.UserID,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean().exec();
        if (docs.length > 0) {
            let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
            ans.push({UserID: user, docs: onePerDay});
        } else {
            ans.push({UserID: user, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }
    let usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        for await (const user of usersID) {
            //if(user.Permission==="yes") {
            let docs = await AccelerometerMetric.find({
                UserID: user.UserID,
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }).lean().exec();
            if (docs.length > 0) {
                let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                ans.push({UserID: user, docs: onePerDay});
            } else {
                ans.push({UserID: user, docs: docs});
            }
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getWeather', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    let ans = [];
    if (req.query.UserID) {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();
        let docs = await WeatherMetric.find({
            UserID: req.query.UserID,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean().exec();
        if (docs.length > 0) {
            let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
            ans.push({UserID: user, docs: onePerDay});
        } else {
            ans.push({UserID: user, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }
    let usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        for await (const user of usersID) {
            //if(user.Permission==="yes") {
            let docs = await WeatherMetric.find({
                UserID: user.UserID,
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }).lean().exec();
            if (docs.length > 0) {
                let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                ans.push({UserID: user, docs: onePerDay});
            } else {
                ans.push({UserID: user, docs: docs});
            }
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getActivity', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    let ans = [];
    if (req.query.UserID) {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();
        let docs = await ActivityMetric.find({
            UserID: req.query.UserID,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean().exec();
        if (docs.length > 0) {
            let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
            ans.push({UserID: user, docs: onePerDay});
        } else {
            ans.push({UserID: user, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }
    let usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        for await (const user of usersID) {
            //if(user.Permission==="yes") {
            let docs = await ActivityMetric.find({
                UserID: user.UserID,
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }).lean().exec();
            if (docs.length > 0) {
                let onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                ans.push({UserID: user, docs: onePerDay});
            } else {
                ans.push({UserID: user, docs: docs});
            }
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});


module.exports = router;
var express = require('express');
var router = express.Router();
var common = require('../common');
var csv = require('csvtojson');
var service = require('../../service');
var patientLastDaySteps = require('../../modules/Destinations').LastDayPatientSteps;
var patientLastWeekSteps = require('../../modules/Destinations').LastWeekPatientStepsSchema;
var StepsMetric = require('../../modules/Metrics').StepsMetric;

var User = require('../../modules/User');
//check
// var StepDestination = require('../../modules/Destinations').StepsDestination;
// var PatientsStepsLevel = require('../../modules/Destinations').PatientsStepsLevel;



router.post('/insertLastWeekSteps', async function (req, res) {
    const user = await patientLastWeekSteps.find({UserID: req.UserID,});
    let size = user.length;
    if (size === 0) {
        let lastWeekSteps = new patientLastWeekSteps({
            UserID: req.UserID,
            CurrentWeekSteps: 0,
            LastWeekStepsNumber: 0,
            WeekNumAfterSurgery: 0,
            Timestamp: (new Date).getTime(),
        });
        await lastWeekSteps.save(function (error) {
            common(res, error, error, lastWeekSteps)
        });
    }
    else {
        var error = { 'message': 'Initial data exist' };
        common(res, error, error, null);
    }
});

router.post('/insertLastDaySteps', async function (req, res) {
    const user = await patientLastDaySteps.find({UserID: req.UserID,});
    let size = user.length;
    if (size === 0) {
        let lastDaySteps = new patientLastDaySteps({
            UserID: req.UserID,
            LastDayStepsNumber: 0,
            Timestamp: (new Date).getTime(),
        });
        await lastDaySteps.save(function (error) {
            common(res, error, error, lastDaySteps)
        });
    }
    else {
        var error = { 'message': 'Initial data exist' };
        common(res, error, error, null);
    }
});

router.get('/checkPatientProgress', async function (req,res){
    let lastDaySteps;
    let currentSteps;
    let timeStepsDone;
    let userID;

    //------------------------new---------------------------
    let surgeryDateVal;
    let currentWeekSteps;
    const user1 = await User.find({UserID: req.UserID,})
    surgeryDateVal = user1[0].DateOfSurgery
    let today = new Date();
    let surgeryDate = new Date(surgeryDateVal)
    const diffTime = (today - surgeryDate);

    const user = await patientLastDaySteps.find({UserID: req.UserID,}).sort({Timestamp: -1}).limit(1).lean().exec();
    lastDaySteps = user[0].LastDayStepsNumber
    console.log(lastDaySteps)
    const lastSteps = await StepsMetric.find({UserID: req.UserID,}).sort({Timestamp: -1}).limit(1).lean().exec();
    currentSteps = lastSteps[0].Data
    userID = lastSteps[0].UserID

    const user2 = await patientLastWeekSteps.find({UserID: req.UserID,});
    currentWeekSteps = user2[0].CurrentWeekSteps
    let accWeekSteps = currentWeekSteps + currentSteps
    const update1 = await patientLastWeekSteps.updateOne({UserID:userID},{CurrentWeekSteps:accWeekSteps});


    let lastDayStepsForHistory = new patientLastDaySteps({
        UserID: userID,
        LastDayStepsNumber: currentSteps,
        Timestamp: (new Date).getTime()
    });

    if(diffTime>0) {
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays + " days");
        if(diffDays<7){
            //-------daily alerts--------
            if(currentSteps>lastDaySteps){
                console.log("well Done! you improved your steps from last day")
                await lastDayStepsForHistory.save(function (error) {
                    common(res,error,error,{targetDone: true, alertsType:"Daily", currentSteps: currentSteps, lastDaySteps:lastDaySteps,popAlert:true} )
                });
            }
            else{
                console.log("You not improved your steps from last day")
                await lastDayStepsForHistory.save(function (error) {
                    common(res,error,error,{targetDone: false, alertsType:"Daily", currentSteps: currentSteps, lastDaySteps:lastDaySteps,popAlert:true} )
                });
            }
        }
        else{
            //---------weekly alerts---------
            if(diffDays % 7 === 0){
                //pop weekly alert after each week (10 days after surgery)
                let lastWeekSteps = user2[0].LastWeekStepsNumber
                if(currentWeekSteps+currentSteps>lastWeekSteps){
                    //weekly target done- pop alert
                    await lastDayStepsForHistory.save(function (error) {
                        common(res,error,error,{targetDone: true, alertsType:"Weekly", currentWeekSteps: currentWeekSteps+currentSteps, LastWeekStepsNumber:lastWeekSteps,popAlert:true} )
                    });
                }
                else{
                    //weekly target failed- pop alert
                    await lastDayStepsForHistory.save(function (error) {
                        common(res,error,error,{targetDone: false, alertsType:"Weekly", currentWeekSteps: currentWeekSteps+currentSteps, LastWeekStepsNumber:lastWeekSteps,popAlert:true} )
                    });
                }
                //new week update last week steps, reset current week steps and update the num of weeks after surgery
                const update2 = await patientLastWeekSteps.updateOne({UserID:userID},{CurrentWeekSteps:0, LastWeekStepsNumber:currentWeekSteps+currentSteps,WeekNumAfterSurgery:diffDays/7 });
                //const update = await patientLastWeekSteps.update({_UserID:userID, CurrentWeekSteps:0, LastWeekStepsNumber:currentWeekSteps,WeekNumAfterSurgery:diffDays/7 })
            }
            else{
                //not pop alert- week not pass just update steps
                await lastDayStepsForHistory.save(function (error) {
                    common(res,error,error,{targetDone: false, alertsType:"Weekly", currentWeekSteps: currentWeekSteps+currentSteps, lastDaySteps:lastDaySteps,popAlert:false} )
                });
            }
        }
    }


    console.log("check")

    //---------------------------- end new--------------------------------

    // const user = await patientLastDaySteps.find({UserID: req.UserID,}).sort({Timestamp: -1}).limit(1).lean().exec();
    // lastDaySteps = user[0].LastDayStepsNumber
    // console.log(lastDaySteps)
    // const lastSteps = await StepsMetric.find({UserID: req.UserID,}).sort({Timestamp: -1}).limit(1).lean().exec();
    // currentSteps = lastSteps[0].Data
    // userID = lastSteps[0].UserID
    // timeStepsDone = lastSteps[0].Timestamp
    // if(currentSteps>lastDaySteps){
    //     let lastDayStepsForHistory = new patientLastDaySteps({
    //         UserID: userID,
    //         LastDayStepsNumber: currentSteps,
    //         Timestamp: (new Date).getTime()
    //     });
    //     console.log("well Done! you improved your steps from last day")
    //     await lastDayStepsForHistory.save(function (error) {
    //         common(res,error,error,{targetDone: true,  currentSteps: currentSteps, lastDaySteps:lastDaySteps} )
    //     });
    // }
    // else{
    //     let lastDayStepsForHistory = new patientLastDaySteps({
    //         UserID: userID,
    //         LastDayStepsNumber: currentSteps,
    //         Timestamp: (new Date).getTime()
    //     });
    //     console.log("You not improved your steps from last day")
    //     await lastDayStepsForHistory.save(function (error) {
    //         common(res,error,error,{targetDone: false,  currentSteps: currentSteps, lastDaySteps:lastDaySteps} )
    //     });
    // }
});

//----------------------------------------------old code-------------------------------------

// router.post('/insertTarget', async function (req, res) {
//     let newTarget = new StepDestination({
//         Target: req.body.target,
//         Level: req.body.level,
//         ExecutionNum: req.body.ExecutionNum,
//         SurgeryType: ""
//     });
//     await newTarget.save(function (error) {
//         common(res, error, error, newTarget)
//     });
// });
//
// router.post('/insertPatientTarget', async function (req, res) {
//     let newPatientTarget = new PatientsStepsLevel({
//         UserID: req.UserID,
//         Level: req.body.level,
//         RepeatsLeft: req.body.RepeatsLeft,
//     });
//     await newPatientTarget.save(function (error) {
//         common(res, error, error, newPatientTarget)
//     });
// });
//
//
// //getPatientLevel
// router.get('/getPatientProgress', async function (req, res) {
//     let currentLevel;
//     let currentRepeats;
//     let TargetDest;
//     let currentSteps;
//     let targetRepeats;
//     let timeStepsDone;
//     let userIdFound;
//
//     const user = await PatientsStepsLevel.findOne({UserID: req.UserID}).lean().exec();
//     currentLevel = user.Level
//     userIdFound = user.UserID
//     currentRepeats = user.RepeatsLeft
//     const target = await StepDestination.findOne({Level: currentLevel}).lean().exec();
//     TargetDest = target.Target
//     targetRepeats = target.ExecutionNum
//
//     const lastSteps = await StepsMetric.find({UserID: req.UserID,}).sort({Timestamp: -1}).limit(1).lean().exec();
//     currentSteps = lastSteps[0].Data
//     timeStepsDone = lastSteps[0].Timestamp
//
//     let today = new Date();
//     let lastDate = new Date(timeStepsDone)
//     if(today.getFullYear() === lastDate.getFullYear() &&
//         today.getMonth() === lastDate.getMonth() &&
//         today.getDate() === lastDate.getDate()){
//
//         if(currentSteps>=TargetDest){
//             if(targetRepeats - currentRepeats === targetRepeats - 1){
//                 let newLevel = currentLevel + 1
//                 const newTarget = await StepDestination.findOne({Level: newLevel}).lean().exec();
//                 let newCurrentRepeats = newTarget.ExecutionNum
//                 let newLevelTarget = newTarget.Target
//
//                 const update = await PatientsStepsLevel.update({_userID:userIdFound,Level:newLevel,RepeatsLeft:newCurrentRepeats})//the new level
//
//                 //return: target done: true, innNewLevel: true, current level: num, repeat left to next level: num
//                 console.log("Well Done you got your target and level up!")
//                 common(res, null, null, {
//                     targetDone: true,  inNewLevel: true, currentLevel:newLevel,repeatsLeft:newCurrentRepeats,stepsTarget:newLevelTarget
//                 });
//             }
//             else{
//                 let newCurrentRepeats = currentRepeats -1
//                 const update = await PatientsStepsLevel.update({_userID:userIdFound,RepeatsLeft:newCurrentRepeats})
//                 console.log("Well Done you got your target!")
//                 common(res, null, null, {
//                     targetDone: true,  inNewLevel: false, currentLevel:currentLevel,repeatsLeft: newCurrentRepeats,stepsTarget:TargetDest
//                 });
//             }// console.log("Well Done you got your target!")
//         }
//         else{
//             console.log("you dont get your target")
//             common(res, null, null, {
//                 targetDone: false,  inNewLevel: false, currentLevel:currentLevel,repeatsLeft: currentRepeats,stepsTarget:TargetDest
//             });
//         }
//
//     }
//     else{
//         common(res, null, null, {
//             targetDone: false,  inNewLevel: false, currentLevel:currentLevel,repeatsLeft: currentRepeats,stepsTarget:TargetDest
//         });
//     }
// });

//----------------------------------------------old code-------------------------------------



module.exports = router;
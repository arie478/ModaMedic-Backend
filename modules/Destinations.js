var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var LastDayPatientStepsSchema = new Schema({
    UserID: String,
    LastDayStepsNumber: Number,
    Timestamp: Number,
});

var LastWeekPatientStepsSchema = new Schema({
    UserID: String,
    CurrentWeekSteps: Number,
    LastWeekStepsNumber: Number,
    WeekNumAfterSurgery: Number,
    Timestamp: Number,
});

//-----------------------------------------old schemas not used-----------------------------------------

// var StepsDestinationSchema = new Schema({
//     Target: Number,
//     Level: Number,
//     ExecutionNum: Number,
//     SurgeryType: String
// });
//
// var PatientsStepsLevelSchema = new Schema({
//     UserID: String,
//     Level: Number,
//     RepeatsLeft: Number
// });

//-----------------------------------------old schemas-----------------------------------------


module.exports.LastDayPatientSteps = mongoose.model('HistoryDaySteps', LastDayPatientStepsSchema, 'HistoryDaySteps');
module.exports.LastWeekPatientStepsSchema = mongoose.model('HistoryWeeklySteps', LastWeekPatientStepsSchema, 'HistoryWeeklySteps');


// module.exports.StepsDestination = mongoose.model('StepsDestination', StepsDestinationSchema, 'StepsDestination');
// module.exports.PatientsStepsLevel = mongoose.model('PatientsStepsTarget', PatientsStepsLevelSchema, 'PatientsStepsTarget');


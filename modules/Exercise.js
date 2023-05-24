var mongoose = require('mongoose');
var service = require('../service.js');
var jwt = require('jsonwebtoken');
var common = require('../routes/common');

//Define a schema
var Schema = mongoose.Schema;

var ExerciseSchema = new Schema({
    ExerciseId : {
        type:String,
        unique:true,
    },
    Category : {
        type:String,
    },
    Video : {
        type:String,
        unique:true
    },
});

//create models
const Exercise = module.exports = mongoose.model('Exercise', ExerciseSchema,'Exercise');

module.exports.createExercise= function(newExercise, callback){
    //console.log(newUser);
    newExercise.save(callback);
};

module.exports.getExercises = async function(callback){
    // var query = {Category: category};
    await Exercise.find({},callback);
};
// module.exports.getExerciseByUrl = async function(url, callback){
//     var query = {Video: url};
//     await Exercise.findOne(query, callback);
// };

module.exports.removeExercise = async function(exerciseId, callback){
    var query = {ExerciseId: exerciseId};
    await Exercise.deleteOne(query, callback);
};

// module.exports.postNewVideo = async function(category,newVideo, callback){
//     var query = {Category: category};
//     let exercises = await Exercise.findOne(query, callback);
//     exercises.Videos.push(newVideo);
//     exercises.save(callback);
// };






var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var VerificationSchema = new Schema({
    QuestionID: {type:Number,
        unique:true
    },
    QuestionText: String
});

//create models
var Verification = module.exports.Verification = mongoose.model('Verification', VerificationSchema, 'Verification');
var VerificationEnglish = module.exports.VerificationEnglish = mongoose.model('VerificationEnglish', VerificationSchema, 'VerificationEnglish');

module.exports.Verification.createVerification= function(newVerification, callback){
    //console.log(newUser);
    newVerification.save(callback);
};

//heb
module.exports.Verification.getOneVerification = function(qid, callback){
    var query = {QuestionID: qid};
    Verification.findOne(query, callback);
};

module.exports.Verification.getAllVerification = function(callback){
    Verification.find({}, callback);
};

module.exports.Verification.createVerification= function(newVerification, callback){
    //console.log(newUser);
    newVerification.save(callback);
};

//eng
module.exports.VerificationEnglish.getOneVerificationEnglish = function(qid, callback){
    var query = {QuestionID: qid};
    VerificationEnglish.findOne(query, callback);
};

module.exports.VerificationEnglish.getAllVerification = function(callback){
    VerificationEnglish.find({}, callback);
};

module.exports.VerificationEnglish.createVerification= function(newVerification, callback){
    //console.log(newUser);
    newVerification.save(callback);
};
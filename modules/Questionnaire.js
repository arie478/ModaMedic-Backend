var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var QuestionnaireSchema = new Schema({
    QuestionnaireID: Number,
    QuestionnaireText: String,
    QuestionnaireEnglishText: String,
    Category: String,
    Questions: [
        {
            QuestionID: Number,
            QuestionText: String,
            Type: String,
            Alone: [
                {
                type: Number
                }
            ],
            Best: String,
            Worst: String,
            Answers: [
                {
                    answerID: Number,
                    answerText: String
                }
            ]
        }
    ]
});



// //create models
// var Questionnaire = module.exports = mongoose.model('Questionnaire', QuestionnaireSchema, 'Questionnaire');

//create models
var Questionnaire = module.exports.Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema, 'Questionnaire');
var QuestionnaireEnglish = module.exports.QuestionnaireEnglish = mongoose.model('QuestionnaireEnglish', QuestionnaireSchema, 'QuestionnaireEnglish');

// module.exports.getQuestionnaire = function(qid, callback){
//     var query = {QuestionnaireID: qid};
//     Questionnaire.findOne(query, callback);
// };
// module.exports.createQuestionnaire = function(newQuestionnaire, callback){
//     //console.log(newUser);
//     newQuestionnaire.save(callback);

module.exports.Questionnaire.getQuestionnaire = function(qid, callback){
    var query = {QuestionnaireID: qid};
    Questionnaire.findOne(query, callback);
};
module.exports.Questionnaire.createQuestionnaire = function(newQuestionnaire, callback){
    //console.log(newUser);
    newQuestionnaire.save(callback);
};

module.exports.QuestionnaireEnglish.getQuestionnaireEnglish = function(qid, callback){
    var query = {QuestionnaireID: qid};
    QuestionnaireEnglish.findOne(query, callback);
};

module.exports.QuestionnaireEnglish.createQuestionnaireEnglish = function(newQuestionnaire, callback){
    //console.log(newUser);
    newQuestionnaire.save(callback);
};


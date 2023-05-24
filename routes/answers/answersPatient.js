var express = require('express');
var router = express.Router();
var common = require('../common');
var csv = require('csvtojson');
var DailyAnswer = require('../../modules/Answer').DailyAnswer;
var PeriodicAnswer = require('../../modules/Answer').PeriodicAnswer;
var service = require('../../service');
var User = require('../../modules/User');
var Permission = require('../../modules/Permission');


var getScore = async function (QuestionnaireID, Answers) {
    var score=0;
    switch(QuestionnaireID){
        case 1:
            await Answers.forEach(function(answer){
                if(answer.AnswerID.length>0)
                    score = score + answer.AnswerID[0];
            });
            score = score*2;
            break;
        case 2:
            await Answers.forEach(function(answer){
                if(answer.AnswerID.length>0)
                    score = score + answer.AnswerID[0];
            });
            break;
        case 3:
            await Answers.forEach(function(answer){
                if(answer.AnswerID.length>0)
                    score = score + answer.AnswerID[0];
            });
            break;
        case 5:
            var answersString = "";
            await Answers.forEach(function(answer){
                answersString = answersString + (answer.AnswerID[0]).toString();
            });
            var results = await csv().fromFile("C:\\Users\\yoni9\\Desktop\\eq5dCalc.csv"); //change here
            score = await searchForScore(results, answersString);
            if(score == null){
                var exception = {'message': 'Invalid Answer'};
                throw exception;
            }
            break;
        case 6:
            score = Answers[0].AnswerID[0];
            break;
    }
    return score;
};

var searchForScore = async function(results, answersString){
    for await (const row of results){
        if(row.answers == answersString){
            return row.spain;
        }
    }
    return null;
};

router.get('/getLastDaily', async function(req, res){
    let userid = req.UserID;
    await DailyAnswer.findOne({UserID:  userid}).lean().sort({ ValidTime: -1 }).exec(function (err, docs) {
        common(res, err, err, docs.ValidTime);
    });
});

router.post('/getLastPeriodicByQuestionnaire', async function(req, res){
    let userid = req.UserID;
    let questionnaireId = req.body.QuestionnaireID;
    await PeriodicAnswer.findOne({UserID:  userid ,QuestionnaireID: questionnaireId}).lean().sort({ ValidTime: -1 }).exec(function (err, docs) {
        common(res, err, err, docs.ValidTime);
    });
});


router.post('/sendAnswers', async function (req, res, next) {
    console.log(req.body);
    if(req.body.QuestionnaireID==0) {
        var newAnswer = new DailyAnswer({
            UserID: req.UserID,
            Timestamp: (new Date).getTime(),
            ValidTime: req.body.ValidTime,
            QuestionnaireID: req.body.QuestionnaireID,
            Answers: req.body.Answers
        });
        await newAnswer.save(function (error) {
            common(res, error, error, newAnswer);
        });
    }
    else{
        try {
            var score = await getScore(req.body.QuestionnaireID, req.body.Answers);
            var newAnswer = new PeriodicAnswer({
                UserID: req.UserID,
                Timestamp: (new Date).getTime(),
                ValidTime: req.body.ValidTime,
                QuestionnaireID: req.body.QuestionnaireID,
                Answers: req.body.Answers,
                Score: score
            });
            await newAnswer.save(function (error) {
                common(res, error, error, newAnswer);
            });
        }
        catch(exception){
            common(res, exception, exception.message, null);
        }
    }
});


router.get('/answeredQuestionnaire', async function (req, res) {
    var userID = req.UserID;
    var days = req.query.days;
    var questionnaireID = req.query.questionnaireID;
    var now = new Date();
    var realNow = now.getTime();
    var start = now.setHours(-(24*days),0,0,0);
    if(questionnaireID==0){
        var docs = await DailyAnswer.find({
            UserID:  userID,
            QuestionnaireID: questionnaireID,
            ValidTime: { $gte: start, $lte: realNow }
        }).lean().exec();
        common(res, null, null, docs.length>0);
    }
    else{
        var docs = await PeriodicAnswer.find({
            UserID:  userID,
            QuestionnaireID: questionnaireID,
            ValidTime: { $gte: start, $lte: realNow }
        }).lean().exec();
        common(res, null, null, docs.length>0);
    }
});


var findUsers = async function(firstName, lastName, doctorID){
    var usersID = [];
    const leanDoc = await User.find({First_Name: firstName, Last_Name: lastName, Type:'patient'}).lean().exec();
    for await (const user of leanDoc){
        /**
         var permission = await Permission.findOne({DoctorID: doctorID, PatientID: user.UserID}).lean().exec();
         if(permission)
         usersID.push({UserID: user.UserID, BirthDate: user.BirthDate, Permission: "yes"});
         else
         usersID.push({UserID: user.UserID, BirthDate: user.BirthDate, Permission: "no"});
         **/
        usersID.push(user);
    }
    return usersID;
};

router.get('/getDailyAnswers', async function (req, res, next) {
    if (typeof (req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof (req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    var ans = [];
    let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
    var docs = await DailyAnswer.find({
        UserID: req.UserID,
        QuestionnaireID: 0,
        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
    }).lean().exec();
    if (docs.length > 0) {
        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
        ans.push({UserID: userObj, docs: onePerDay});
    } else
        ans.push({UserID: userObj, docs: docs});
    common(res, null, null, ans);

});

router.get('/getPeriodicAnswers', async function (req, res, next) {
    if (typeof (req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof (req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
        var ans = [];
        var questionnaires = [];
        let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
        questionnaires = userObj.Questionnaires;
        for await (const quest of questionnaires){
            if(quest.QuestionnaireID !== 0) {
                var docs = await PeriodicAnswer.find({
                    UserID: req.UserID,
                    QuestionnaireID: quest.QuestionnaireID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    let docs2 = {QuestionnaireID: quest.QuestionnaireID, data: onePerDay};
                    ans.push({UserID: userObj, docs: docs2});
                } else {
                    let docs2 = {QuestionnaireID: quest.QuestionnaireID, data: docs};
                    ans.push({UserID: userObj, docs: docs2});
                }
            }
        }
        common(res, null, null, ans);
});

module.exports = router;
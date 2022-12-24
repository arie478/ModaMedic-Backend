var express = require('express');
var router = express.Router();
var common = require('./common');
var Questionnaire = require('../modules/Questionnaire').Questionnaire;
var QuestionnaireEnglish = require('../modules/Questionnaire').QuestionnaireEnglish;


router.get('/getQuestionnaire/:QuestionnaireID', async function (req, res) {
    await Questionnaire.getQuestionnaire(req.params.QuestionnaireID,function (err, questionnaire) {
        if(err)
            common(res, true, err, null);
        else
            common(res, false, null, questionnaire);
    });
});

router.get('/getQuestionnaire/:QuestionnaireID/:Language', async function (req, res) {
    let lang = req.params.Language;
    if (lang === 'he' || lang === 'iw'){
        await Questionnaire.getQuestionnaire(req.params.QuestionnaireID, function (err, questionnaire) {
            if (err)
                common(res, true, err, null);
            else
                common(res, false, null, questionnaire);
        });
    }
    else {
        await QuestionnaireEnglish.getQuestionnaireEnglish(req.params.QuestionnaireID, function (err, questionnaire) {
            if (err)
                common(res, true, err, null);
            else
                common(res, false, null, questionnaire);
        });
    }
});


router.get('/all', async function (req, res) {
    await Questionnaire.find({}, async function (err, questionnaires) {
        if(questionnaires) {
            if (err)
                common(res, true, err, null);
            else {
                let data = [];
                await questionnaires.forEach(function (q) {
                    var obj = {QuestionnaireID: q.QuestionnaireID, QuestionnaireText: q.QuestionnaireText};
                    data.push(obj);
                });
                common(res, false, null, data);
            }
        }
        else{
            common(res, false, "Not Found", null);
        }
    });
});


router.get('/all/:Language', async function (req, res) {
    let lang = req.params.Language;
    if (lang === 'he' || lang === 'iw') {
    await Questionnaire.find({}, async function (err, questionnaires) {
        if (questionnaires) {
            if (err)
                common(res, true, err, null);
            else {
                let data = [];
                await questionnaires.forEach(function (q) {
                    var obj = {QuestionnaireID: q.QuestionnaireID, QuestionnaireText: q.QuestionnaireText};
                    data.push(obj);
                });
                common(res, false, null, data);
            }
        } else {
            common(res, false, "Not Found", null);
        }
    });
    }
    else {
        await QuestionnaireEnglish.find({}, async function (err, questionnaires) {
            if (questionnaires) {
                if (err)
                    common(res, true, err, null);
                else {
                    let data = [];
                    await questionnaires.forEach(function (q) {
                        var obj = {QuestionnaireID: q.QuestionnaireID, QuestionnaireText: q.QuestionnaireText};
                        data.push(obj);
                    });
                    common(res, false, null, data);
                }
            } else {
                common(res, false, "Not Found", null);
            }
        });
    }
});


module.exports = router;
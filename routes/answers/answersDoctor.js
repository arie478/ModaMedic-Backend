var express = require('express');
var router = express.Router();
var common = require('../common');
var DailyAnswer = require('../../modules/Answer').DailyAnswer;
var PeriodicAnswer = require('../../modules/Answer').PeriodicAnswer;
var service = require('../../service');
var User = require('../../modules/User');
var Permission = require('../../modules/Permission');


var findUsers = async function(firstName, lastName, doctorID)
{
    var usersID = [];
    const leanDoc = await User.find({First_Name: firstName, Last_Name: lastName, Type:'patient'}).lean().exec();

    for await (const user of leanDoc)
    {
        // var permission = await Permission.findOne({DoctorID: doctorID, PatientID: user.UserID}).lean().exec();
        //
        // if(permission)
        //     usersID.push({UserID: user.UserID, BirthDate: user.BirthDate, Permission: "yes"});
        //
        // else
        //     usersID.push({UserID: user.UserID, BirthDate: user.BirthDate, Permission: "no"});

        usersID.push(user);
    }
    return usersID;
};

router.get('/getDailyAnswers', async function (req, res, next)
{
    if (typeof (req.query.start_time) == 'undefined')
    {
        req.query.start_time = 0;
    }

    if (typeof (req.query.end_time) == 'undefined')
    {
        req.query.end_time = (new Date).getTime();
    }

    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    let ans = [];

    if (req.query.UserID)
    {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();
        var docs = await DailyAnswer.find({
            UserID: req.query.UserID,
            QuestionnaireID: 0,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean().exec();

        if (docs.length > 0)
        {
            var onePerDay = service.findMostRecent(docs, req.query.start_time, req.query.end_time);
            ans.push({UserID: user, docs: onePerDay});
        }

        else
        {
            ans.push({UserID: user, docs: docs});
        }

        common(res, null, null, ans);
        return;
    }

    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);

    if(usersID.length > 0)
    {
        for await (const user of usersID)
        {
            var docs = await DailyAnswer.find({
                UserID: user.UserID,
                QuestionnaireID: 0,
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }).lean().exec();

            if (docs.length > 0)
            {
                var onePerDay = service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                ans.push({UserID: user, docs: onePerDay});
            }

            else
            {
                ans.push({UserID: user, docs: docs});
            }
        }

        common(res, null, null, ans);
    }

    else
    {
        common(res, null, "Not Found", null);
    }
});

router.get('/getPeriodicAnswers', async function (req, res, next)
{
    if (typeof (req.query.start_time) == 'undefined')
    {
        req.query.start_time = 0;
    }

    if (typeof (req.query.end_time) == 'undefined')
    {
        req.query.end_time = (new Date).getTime();
    }

    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    let ans = [];

    if (req.query.UserID)
    {
        let user = await User.findOne({UserID: req.query.UserID}).lean().exec();

        for await (const quest of user.Questionnaires)
        {
            if(quest.QuestionnaireID !== 0)
            {
                var docs = await PeriodicAnswer.find({
                    UserID: req.query.UserID,
                    QuestionnaireID: quest.QuestionnaireID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();

                if (docs.length > 0)
                {
                    var onePerDay = service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    let docs2 = {QuestionnaireID: quest.QuestionnaireID, data: onePerDay};
                    ans.push({UserID: user, docs: docs2});
                }

                else
                {
                    let docs2 = {QuestionnaireID: quest.QuestionnaireID, data: docs};
                    ans.push({UserID: user, docs: docs2});
                }
            }
        }

        common(res, null, null, ans);
        return;
    }

    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);

    if(usersID.length > 0)
    {
        for await (const user of usersID)
        {
            let userObj = await User.findOne({UserID: user.UserID}).lean().exec();
            let questionnaires = userObj.Questionnaires;

            for await (const quest of questionnaires)
            {
                if(quest.QuestionnaireID !== 0)
                {
                    var docs = await PeriodicAnswer.find({
                        UserID: user.UserID,
                        QuestionnaireID: quest.QuestionnaireID,
                        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                    }).lean().exec();

                    if (docs.length > 0)
                    {
                        var onePerDay = service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                        let docs2 = {QuestionnaireID: quest.QuestionnaireID, data: onePerDay};
                        ans.push({UserID: user, docs: docs2});
                    }

                    else
                    {
                        let docs2 = {QuestionnaireID: quest.QuestionnaireID, data: docs};
                        ans.push({UserID: user, docs: docs2});
                    }
                }
            }
        }

        common(res, null, null, ans);
    }

    else
    {
        common(res, null, "Not Found", null);
    }
});

module.exports = router;
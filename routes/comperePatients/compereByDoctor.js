var express = require('express');
var router = express.Router();
let common = require('../common');
let DistanceMetric = require('../../modules/Metrics').DistanceMetric;
let CaloriesMetric = require('../../modules/Metrics').CaloriesMetric;
let StepsMetric = require('../../modules/Metrics').StepsMetric;


router.get('/getDistanceCompere', async function (req, res, next) {
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
    if (req.query.groupId) {
        let docs = await DistanceMetric.find({
            UserID: req.query.groupId,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean();
        if (docs.length > 0) {
            ans.push({GroupID:req.query.groupId, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }

});

router.get('/getStepsCompere', async function (req, res, next) {
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
    if (req.query.groupId) {
        let docs = await StepsMetric.find({
            UserID: req.query.groupId,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean();
        if (docs.length > 0) {
            ans.push({GroupID:req.query.groupId, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }

});

router.get('/getCaloriesCompere', async function (req, res, next) {
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
    if (req.query.groupId) {
        let docs = await CaloriesMetric.find({
            UserID: req.query.groupId,
            ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
        }).lean();
        if (docs.length > 0) {
            ans.push({GroupID:req.query.groupId, docs: docs});
        }
        common(res, null, null, ans);
        return;
    }

});

module.exports = router;
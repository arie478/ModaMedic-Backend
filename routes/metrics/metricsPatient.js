const express = require('express');
const router = express.Router();
const common = require('../common');
const StepsMetric = require('../../modules/Metrics').StepsMetric;
const DistanceMetric = require('../../modules/Metrics').DistanceMetric;
const CaloriesMetric = require('../../modules/Metrics').CaloriesMetric;
const SleepMetric = require('../../modules/Metrics').SleepMetric;
const AccelerometerMetric = require('../../modules/Metrics').AccelerometerMetric;
const WeatherMetric = require('../../modules/Metrics').WeatherMetric;
const ActivityMetric = require('../../modules/Metrics').ActivityMetric;
var User = require('../../modules/User');
var Permission = require('../../modules/Permission');
var service = require('../../service');

var getDate = function (timestamp) {
    date = new Date(timestamp).toISOString();
    date_string = date.slice(0, 10) + ' ' + date.slice(-13, -8)
    return date_string;
};

router.post('/steps', async function (req, res, next) {
    let newMetric = new StepsMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    await newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/distance', async function (req, res, next) {
    let newMetric = new DistanceMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    await newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/calories', async function (req, res, next) {
    let newMetric = new CaloriesMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    await newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/sleep', async function (req, res, next) {
    let newMetric = new SleepMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    await newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/accelerometer', async function (req, res, next) {
    let newMetric = new AccelerometerMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    await newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/weather', async function (req, res, next) {
    let newMetric = new WeatherMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    await newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/activity', async function (req, res, next) {
    let newMetric = new ActivityMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    await newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});


router.get('/getMissingDates', async function (req, res, next){
    var userID = req.UserID;
    var days = req.query.days;
    var realNow = new Date().setHours(-48,0,0,0);
    var start = new Date().setHours(-(24*days),0,0,0);
    var ans = [];
    var docs = [];
    var dates= [];
    docs = await getRecordsBetweenDates(userID, start, realNow, "Steps");
    dates = await findDates(start, realNow, docs);
    ans.push({Steps: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Calories");
    dates = await findDates(start, realNow, docs);
    ans.push({Calories: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Distance");
    dates = await findDates(start, realNow, docs);
    ans.push({Distance: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Sleep");
    dates = await findDates(start, realNow, docs);
    ans.push({Sleep: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Accelerometer");
    dates = await findDates(start, realNow, docs);
    ans.push({Accelerometer: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Weather");
    dates = await findDates(start, realNow, docs);
    ans.push({Weather: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Activity");
    dates = await findDates(start, realNow, docs);
    ans.push({Activity: dates});
    common(res,null,null, ans);
});

var getRecordsBetweenDates = async function(userID, start, realNow, metric){
    var docs = [];
    switch(metric){
        case "Steps":
            docs = await StepsMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lt: realNow }
            }).lean().exec();
            break;
        case "Calories":
            docs = await CaloriesMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lt: realNow }
            }).lean().exec();
            break;
        case "Distance":
            docs = await DistanceMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lt: realNow }
            }).lean().exec();
            break;
        case "Sleep":
            docs = await SleepMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lt: realNow }
            }).lean().exec();
            break;
        case "Accelerometer":
            docs = await AccelerometerMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lt: realNow }
            }).lean().exec();
            break;
        case "Weather":
            docs = await WeatherMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lt: realNow }
            }).lean().exec();
            break;
        case "Activity":
            docs = await ActivityMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lt: realNow }
            }).lean().exec();
            break;
    }
    return docs;
};

var findDates = function(start, realNow, docs){
    var temp;
    var dates = [];
    for(temp = start; temp < realNow; temp+=(24*3600*1000)) {
        var hasfound = false;
        var i;
        for (i=0; i<docs.length; i++) {
            if (docs[i].ValidTime < temp + (24 * 3600 * 1000) && docs[i].ValidTime >= temp) {
                hasfound = true;
                break;
            }
        }
        if (!hasfound)
            dates.push(temp);
    }
    dates.push((new Date().setHours(-48,0,0,0)));
    dates.push((new Date().setHours(-24,0,0,0)));
    dates.push((new Date().setHours(0,0,0,0)));
    return dates;
};



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
    var ans = [];
    let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
    var docs = await StepsMetric.find({
        UserID: req.UserID,
        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
    }).lean().exec();
    if (docs.length > 0) {
        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
        ans.push({UserID: userObj, docs: onePerDay});
    } else
        ans.push({UserID: userObj, docs: docs});
    common(res, null, null, ans);
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
    var ans = [];
    let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
    var docs = await DistanceMetric.find({
        UserID: req.UserID,
        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}}).lean().exec();
    if (docs.length > 0) {
        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
        ans.push({UserID: userObj, docs: onePerDay});
    } else
        ans.push({UserID: userObj, docs: docs});
    common(res, null, null, ans);
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
    var ans = [];
    let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
    var docs = await CaloriesMetric.find({
        UserID: req.UserID,
        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
    }).lean().exec();
    if (docs.length > 0) {
        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
        ans.push({UserID: userObj, docs: onePerDay});
    } else
        ans.push({UserID: userObj, docs: docs});

    common(res, null, null, ans);
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
    var ans = [];
    let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
    var docs = await SleepMetric.find({
        UserID: req.UserID,
        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
    }).lean().exec();
    if (docs.length > 0) {
        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
        ans.push({UserID: userObj, docs: onePerDay});
    } else
        ans.push({UserID: userObj, docs: docs});
    common(res, null, null, ans);
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
    var ans = [];
    let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
    var docs = await AccelerometerMetric.find({
        UserID: req.UserID,
        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
    }).lean().exec();
    if (docs.length > 0) {
        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
        ans.push({UserID: userObj, docs: onePerDay});
    } else
        ans.push({UserID: userObj, docs: docs});
    common(res, null, null, ans);
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
    var ans = [];
    let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
    var docs = await WeatherMetric.find({
        UserID: req.UserID,
        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
    }).lean().exec();
    if (docs.length > 0) {
        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
        ans.push({UserID: userObj, docs: onePerDay});
    } else
        ans.push({UserID: userObj, docs: docs});
    common(res, null, null, ans);
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
    var ans = [];
    let userObj = await User.findOne({UserID: req.UserID}).lean().exec();
    var docs = await ActivityMetric.find({
        UserID: req.UserID,
        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
    }).lean().exec();
    if (docs.length > 0) {
        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
        ans.push({UserID: userObj, docs: onePerDay});
    } else
        ans.push({UserID: userObj, docs: docs});
    common(res, null, null, ans);
});

module.exports = router;
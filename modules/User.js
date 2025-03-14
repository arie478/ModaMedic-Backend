var mongoose = require('mongoose');
var service = require('../service.js');
var jwt = require('jsonwebtoken');
var common = require('../routes/common');

// Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    UserID : {
        type:String,
        index:true,
        unique: true
    },
    Password: String,
    First_Name: String,
    Last_Name: String,
    Phone_Number: String,
    Gender: String,
    Smoke: String,
    SurgeryType: String,
    Education: String,
    Height: Number,
    Weight: Number,
    BMI: String,
    BMI_NUMBER: Number,
    BirthDate: Number,
    Type: [String],
    DateOfSurgery: Number,
    VerificationQuestion: Number,
    VerificationAnswer: String,
    Questionnaires: {
        type: [
                {
                    QuestionnaireID: Number,
                    QuestionnaireText: String
                }
            ],
        default: undefined
    },
    changedSurgeryDate: Boolean,
    changedQuestionnaires: Boolean,
    ValidTime: Number,
    Timestamp: Number
});

// Create models
var User = module.exports = mongoose.model('User', UserSchema,'User');

var secret = "secret";
var tempToken = "password";

// Creates user in db
module.exports.createUser = function(newUser, callback)
{
    // console.log(newUser);
    newUser.save(callback);
};

// Gets user from db by username
module.exports.getUserByUserID = async function(userid, callback)
{
    var query = {UserID: userid};
    await User.findOne(query, callback);
};

// Gets user from db by name
module.exports.getUserByName = async function(firstName, lastName, type, callback)
{
    var query = {First_Name: firstName, Last_Name: lastName, Type:type};
    await User.find(query, callback);
};

module.exports.privateCheck = function(req, res, next)
{
    const token = req.header("x-auth-token");

    // No token
    if (!token)
    {
        var error = {'message': 'Access denied. No token provided.'};
        common(res, error, error, null);
    }

    // Verify token
    else
    {
        try
        {
            const decoded = jwt.verify(token, secret);
            var userId = decoded.UserID;
            req.UserID = userId;
            req.Type = decoded.Type;
            req.decoded = decoded;
            next(); // move on to the actual function
        }

        catch (exception)
        {
            var error = {'message': 'Invalid Token'};
            common(res, error, error, null);
        }
    }
};

module.exports.patientCheck = function(req, res, next)
{
    const token = req.header("x-auth-token");

    // Verify token
    try
    {
        const decoded = jwt.verify(token, secret);
        var userType = decoded.Type;

        if(userType.includes("patient"))
        {
            req.Type = userType;
            next(); // move on to the actual function
        }

        else
        {
            var error = {'message': 'permission denied, required patient'};
            common(res, error, error, null);
        }
    }

    catch (exception)
    {
        var error = {'message': 'Invalid Token'};
        common(res, error, error, null);
    }
};

module.exports.doctorCheck = function(req, res, next)
{
    const token = req.header("x-auth-token");

    // Verify token
    try
    {
        const decoded = jwt.verify(token, secret);
        var userType = decoded.Type;

        if(userType.includes("doctor"))
        {
            req.Type = userType;
            next(); // move on to the actual function
        }

        else
        {
            var error = {'message': 'permission denied, required doctor'};
            common(res, error, error, null);
        }
    }

    catch (exception)
    {
        var error = {'message': 'Invalid Token'};
        common(res, error, error, null);
    }
};

module.exports.adminCheck = function(req, res, next)
{
    const token = req.header("x-auth-token");

    // verify token
    try
    {
        const decoded = jwt.verify(token, secret);
        var userType = decoded.Type;

        if(userType.includes("admin"))
        {
            req.Type = userType;
            next(); // move on to the actual function
        }

        else
        {
            var error = {'message': 'permission denied, required admin'};
            common(res, error, error, null);
        }
    }

    catch (exception)
    {
        var error = {'message': 'Invalid Token'};
        common(res, error, error, null);
    }
};

module.exports.passwordCheck = function(req, res, next)
{
    const token = req.header("x-auth-token");

    // No token
    if (!token)
    {
        var error = {'message': 'Access denied. No token provided.'};
        common(res, error, error, null);
    }

    // verify token
    else
    {
        try
        {
            const decoded = jwt.verify(token, tempToken);
            var userId = decoded.UserID;
            req.UserID = userId;
            req.decoded = decoded;
            next(); // move on to the actual function
        }

        catch (exception)
        {
            var error = {'message': 'Invalid Token'};
            common(res, error, error, null);
        }
    }
};

// Returns if entered password matches saved password (using hash)
module.exports.comparePassword = function(candidatePassword, hash, callback)
{
    var hasedPassword = service.hashElement(candidatePassword);
    var isMatch = false;

    if (hasedPassword === hash)
        isMatch = true;

    callback(null, isMatch);
};

// Changes password saved in db
module.exports.changePassword = function(user, newPassword, callback)
{
    if(typeof(newPassword) == 'undefined')
    {
        var error = {'message': 'Error has occured. Please try again.'};
        callback(error);
    }

    else
    {
        user.Password = service.hashElement(newPassword);
        user.save(callback);
    }
};

module.exports.editUser = function(user, field,val, callback)
{
    if(typeof(val) == 'undefined')
    {
        var error = {'message': 'Error has occured. Please try again.'};
        callback(error);
    }

    else
    {
        user[field] = val;
        user.save(callback);
    }
};

module.exports.updateUser = function(user, callback)
{
    user.save(callback);
};
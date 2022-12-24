var mongoose = require('mongoose');
var service = require('../service.js');
var jwt = require('jsonwebtoken');
var common = require('../routes/common');
let User = require('./User');

//Define a schema
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    groupId : {
        type:String,
        index:true,
        unique: true
    },
    filter:{
        filterName:String,
        filterValue:String
    }
});

//create model
var Group = module.exports = mongoose.model('Group', GroupSchema,'Group');


//gets group from db by groupId
module.exports.getGroupByGroupID = async function(groupid, callback){
    var query = {GroupID: groupid};
    Group.findOne(query, callback);

};

//gets all groups from DB
module.exports.getAllGroups  = async () => {
    return await Group.find({}).lean();
};
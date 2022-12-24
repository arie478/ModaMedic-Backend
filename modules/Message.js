var mongoose = require('mongoose');
var service = require('../service.js');
var jwt = require('jsonwebtoken');
var common = require('../routes/common');

//Define a schema
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    MessageId : {
        type:String,
        unique:true,
    },
    From : {
        type:String,
        index:true,
    },
    To : {
        type:String,
        index:true,
    },
    Content: String,
    Date: Number,
    FromFirstName: String,
    FromLastName: String
});

//create models
const Message = module.exports = mongoose.model('Message', MessageSchema,'Message');

//creates message in db
module.exports.createMessage = function(newMessage, callback){
    //console.log(newUser);
    newMessage.save(callback);
};

//gets messages from db by username
module.exports.getUserMessages = async function(userid, callback){
    var query = {To: userid};
    await Message.find(query, callback);
};


module.exports.removeMessage = async function(messageId, callback){
    var query = {MessageId: messageId};
    await Message.deleteOne(query, callback);
};
//
// module.exports.updateMessage = async function(messageId, newContent ,callback){
//     var query = {MessageId: messageId, Content: newContent};
//     await Message.updateOne(query, callback);
// };








var mongoose = require('mongoose');
var service = require('../service.js');
var jwt = require('jsonwebtoken');
var common = require('../routes/common');

//Define a schema
var Schema = mongoose.Schema;

var InstructionsSurgerySchema = new Schema({
    InstructionId : {
        type:String,
        unique:true,
    },
    Title : {
        type: String
    },
    PdfName: {
        type: String
    },
    ImagePart: {
        type: String
    },
    Category: {
        type: String
    }

    // Target : {
    //     type:Array,
    // },
    // TestsResults : {
    //     type:Array,
    // },
    // TestProcess: {
    //     type:Array,
    // }
});

//create models
const InstructionsSurgery = module.exports = mongoose.model('InstructionsSurgery', InstructionsSurgerySchema,'InstructionsSurgery');

module.exports.createInstructionsSurgery = function(newInstruction, callback){
    //console.log(newUser);
    newInstruction.save(callback);
};

//gets messages from db by username
module.exports.getInstructionsSurgery = async function({}, callback){
    // var query = {InstructionId: instructionId};
    await InstructionsSurgery.find({}, callback);
};

module.exports.deleteInstruction = function(id, callback){
    InstructionsSurgery.deleteOne({ InstructionId: id }, callback);
};







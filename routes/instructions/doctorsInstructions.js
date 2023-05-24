var express = require('express');
var router = express.Router();
var common = require('../common');
var Instruction = require('../../modules/InstructionsSurgery');
const { v4: uuidv4 } = require('uuid');
const GridFSMiddleware = require("../../instructionsUpload/gridfs-middleware");
const asyncWrapper = require("../../instructionsUpload/async-wrapper");
const {deleteFile} = require("../../instructionsUpload/my-gridfs-service");

// async function createInstruction(req, res) {
//     const newInstruction = new Instruction({
//         InstructionId: req.body.InstructionId,
//         Title: req.body.Title,
//         Category: req.body.Category,
//     });
//     await Instruction.createInstructionsSurgery(newInstruction, function (err, instruction) {
//         if (err)
//             common(res, true, err, null);
//         else
//             common(res, false, null, {
//                 instructionId: instruction.InstructionId
//             });
//     });
// }

// router.post('/', async function (req, res) {
//     await createInstruction(req, res);
// });


/** @route  POST /pdf
 *  @desc   Upload PDF
 */
router.post("/",
    [GridFSMiddleware()],
    asyncWrapper(async (req, res) => {
        // let category = req.body.category;
        // console.log(category);
        // const { originalname, mimetype, id, size } = req.file;
        // res.send({ originalname, mimetype, id, size });
        const newInstruction = new Instruction({
            InstructionId: req.file.id,
            Title: req.body.Title,
            Category: req.body.Category,
        });
        Instruction.createInstructionsSurgery(newInstruction, function (err, instruction) {
            if (err) {
                common(res, true, err, null);
            } else {
                common(res, false, null, {
                    instructionId: instruction.InstructionId
                });
            }
        });
    })
);

router.delete("/:id",
    asyncWrapper(async (req, res) => {
        const instructionId = req.params.id;
        deleteFile(instructionId);
        Instruction.deleteInstruction(instructionId, function (err, instruction) {
            if (err) {
                common(res, true, err, null);
            } else {
                common(res, false, null, {
                    instructionId: instruction.InstructionId
                });
            }
        });
    })
);

module.exports = router;
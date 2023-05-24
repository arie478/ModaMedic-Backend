var express = require('express');
var router = express.Router();
var common = require('../common');
var Message = require('../../modules/Message');
const { v4: uuidv4 } = require('uuid');
var User = require('../../modules/User');


router.get('/:patientId', async function (req, res) {
    await Message.getUserMessages(req.params.patientId,function (err, messages) {
        if(err)
            common(res, true, err, null);
        else
            common(res, false, null, messages);
    });
});


router.post('/:patientId', async function (req, res) {
    await User.getUserByUserID(req.UserID , async function (err, user) {
        let newMessage = new Message({
            MessageId: uuidv4(),
            From: req.UserID,
            To: req.params.patientId,
            Content: req.body.content,
            Date: new Date().getTime(),
            FromFirstName: user.First_Name,
            FromLastName: user.Last_Name
        });
        await Message.createMessage(newMessage, function (err, message) {
            if (err)
                common(res, true, err, null);
            else
                common(res, false, null, {
                    messageId: message.MessageId
                });
        });
    });
});

router.delete('/removeMessage/:messageId', async function (req, res) {
    await User.getUserByUserID((req.UserID), async function (err, user) {
        if (err) {
            common(res, true, err, null);
            return;
        }
        await Message.removeMessage(req.params.messageId, function (err, message) {
            if (err)
                common(res, true, err, null);
            else
                common(res, false, null, {
                    messageId: message.MessageId
                });
        });
    });
});


module.exports = router;
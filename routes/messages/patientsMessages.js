var express = require('express');
var router = express.Router();
var common = require('../common');
var Message = require('../../modules/Message');
const { v4: uuidv4 } = require('uuid');
var User = require('../../modules/User');


router.get('/', async function (req, res) {
  await Message.getUserMessages(req.UserID,function (err, messages) {
    if(err)
      common(res, true, err, null);
    else
      common(res, false, null, messages);
  });
});


router.post('/', async function (req, res) {
  await User.getUserByUserID((req.UserID), async function (err, user) {
    if (err) {
      common(res, true, err, null);
      return;
    }
    const newMessage = new Message({
      MessageId: uuidv4(),
      From: req.UserID,
      To: req.UserID,
      Content: req.body.content,
      Date: new Date().getTime(),
      FromFirstName: user.First_Name || user._doc.First_Name,
      FromLastName: user.Last_Name || user._doc.Last_Name
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

router.post('/removeMessage', async function (req, res) {
  await User.getUserByUserID((req.UserID), async function (err, user) {
    if (err) {
      common(res, true, err, null);
      return;
    }
    if(req.body.MessageId){
      await Message.removeMessage(req.body.MessageId, function (err, message) {
        if (err)
          common(res, true, err, null);
        else
          common(res, false, null, {
            messageId: message.MessageId
          });
      });}
  });
});

// router.put('/updateMessage', async function (req, res) {
//   await User.getUserByUserID((req.UserID), async function (err, user) {
//     if (err) {
//       common(res, true, err, null);
//       return;
//     }
//     await Message.updateMessage(req.body.MessageId, req.body.Content, function (err, message) {
//       if (err)
//         common(res, true, err, null);
//       else
//         common(res, false, null, {
//           messageId: message.MessageId
//         });
//     });
//   });
// });


module.exports = router;
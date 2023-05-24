var express = require('express');
var router = express.Router();
var User = require('../modules/User');
// var Questionnaire = require('../modules/Questionnaire');
var Questionnaire = require('../modules/Questionnaire').Questionnaire;
var QuestionnaireEnglish = require('../modules/Questionnaire').QuestionnaireEnglish;
var common = require('./common');
var jwt = require('jsonwebtoken');
var tempToken = "password";
var Exercise = require('../modules/Exercise');
var Instruction = require('../modules/InstructionsSurgery');
const { createGridFSReadStream, getGridFSFiles } = require("../instructionsUpload/my-gridfs-service");
const asyncWrapper = require("../instructionsUpload/async-wrapper");


router.get('/getFirsts', async function(req, res) {
  var allUsers = await User.find({Type: ["patient"]}).lean().exec();
  var ans = [];
  for await(const user of allUsers){
    ans.push(user.First_Name);
  }
  common(res, null, null, ans);
});

router.get('/getLasts', async function(req, res) {
  var allUsers = await User.find({Type: ["patient"]}).lean().exec();
  var ans = [];
  for await(const user of allUsers){
    ans.push(user.Last_Name);
  }
  common(res, null, null, ans);
});

router.get('/getNames', async function(req, res) {
  var allUsers = await User.find({Type: ["patient"]}).lean().exec();
  var ans = [];
  for await(const user of allUsers){
    ans.push({first: user.First_Name, last: user.Last_Name});
  }
  common(res, null, null, ans);
});


router.get('/getUserQuestionnaire', async function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.query.UserID;
  await User.getUserByUserID(userid, function (err, user) {
    if(err)
      common(res, true, err, null);
    else{
      if(user)
        common(res, false, null, user.Questionnaires);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.get('/getUserQuestionnaire/:Language', async function(req, res) {
  let lang = req.params.Language;

  var userid = "";
  if (req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.query.UserID;
  if (lang === 'he' || lang === 'iw') {
  await User.getUserByUserID(userid, function (err, user) {
    if (err)
      common(res, true, err, null);
    else {
      if (user)
        common(res, false, null, user.Questionnaires);
      else
        common(res, false, "Not Found", null);
    }
  });
  }
  else{
    await User.getUserByUserID(userid, async function (err, user) {
      let userQuestionnaires = user.Questionnaires
      let i;
      let j;
      let data =[]

      let idQuestionnairesUserArr =[]
      for (i=0;i < userQuestionnaires.length; i++){
        idQuestionnairesUserArr.push(userQuestionnaires[i]['_doc'].QuestionnaireID)
      }
      for (j = 0; j < idQuestionnairesUserArr.length; j++) {
        const question = await QuestionnaireEnglish.find({QuestionnaireID: idQuestionnairesUserArr[j],})
        let question_text = question[0]['_doc'].QuestionnaireText
        let ques = {QuestionnaireID: idQuestionnairesUserArr[j], QuestionnaireText: question_text}
        data.push(ques)
      }

      if (err)
        common(res, true, err, null);
      else {
        if (user)

          common(res, false, null, data);
        else
          common(res, false, "Not Found", null);
      }
    });
  }
});

//check
router.get('/getChangeWithSurgeryOrQuestionnaires', async function(req, res) {
  // let  status_array = []
  const user1 = await User.find({UserID: req.UserID,})
  let changedQuestionnaires = user1[0].changedQuestionnaires;
  let changedSurgeryDate = user1[0].changedSurgeryDate;
  // status_array.push(changedQuestionnaires)
  // status_array.push(changedSurgeryDate)
  common(res, false, null, {changedQuestionnaires: changedQuestionnaires, changedSurgeryDate:changedSurgeryDate});
});

//****
// router.post('/getUserQuestionnaireByCategory', async function(req, res) {
//   const user1 = await User.find({UserID: req.UserID,})
//   let idQuestionnairesArr =[]
//   let titles_arr = []
//   let num_questionnaires = user1[0].Questionnaires.length;
//   let category = req.body.Category;
//   let i;
//   let j;
//   for (i = 0; i < num_questionnaires; i++) {
//       idQuestionnairesArr.push(user1[0].Questionnaires[i]['_doc'].QuestionnaireID)
//   }
//   for (j = 0; j < idQuestionnairesArr.length; j++) {
//     const question = await Questionnaire.find({QuestionnaireID: idQuestionnairesArr[j],})
//     let question_category = question[0]['_doc'].Category
//     if (category === question_category){
//       let question_title = question[0]['_doc'].QuestionnaireText
//       titles_arr.push(question_title)
//     }
//   }
//   common(res, false, null, titles_arr);
// });


router.get('/getUserQuestionnaireByCategory/:Category/:Language', async function(req, res) {
  let lang = req.params.Language;
  let category = req.params.Category;
  const user1 = await User.find({UserID: req.UserID,})
  let idQuestionnairesArr =[]
  let titles_arr = []
  let num_questionnaires = user1[0].Questionnaires.length;

  let i;
  let j;
  for (i = 0; i < num_questionnaires; i++) {
    idQuestionnairesArr.push(user1[0].Questionnaires[i]['_doc'].QuestionnaireID)
  }
  if (lang === 'he' || lang === 'iw') {
    for (j = 0; j < idQuestionnairesArr.length; j++) {
      const question = await Questionnaire.find({QuestionnaireID: idQuestionnairesArr[j],})
      let question_category = question[0]['_doc'].Category
      if (category === question_category) {
        let question_title = question[0]['_doc'].QuestionnaireText
        titles_arr.push(question_title)
      }
    }
  }
  else {
    for (j = 0; j < idQuestionnairesArr.length; j++) {
      const question = await QuestionnaireEnglish.find({QuestionnaireID: idQuestionnairesArr[j],})
      let question_category = question[0]['_doc'].Category
      if (category === question_category) {
        let question_title = question[0]['_doc'].QuestionnaireText
        titles_arr.push(question_title)
      }
    }
  }
  common(res, false, null, titles_arr);
});

// router.post('/changeUserQuestionnaire', async function(req, res) {
//   let daily = {QuestionnaireID: 0, QuestionnaireText: "יומי"};
//   let questionnairesArr = [daily];
//   let Questionnaires = req.body.Questionnaires;
//   if(Questionnaires.length>0){
//     for await (const q of Questionnaires){
//       if(q.QuestionnaireID==5){
//         let eq6 = {QuestionnaireID: 6, QuestionnaireText: "דירוג איכות חיים"};
//         questionnairesArr.push(eq6);
//       }
//       questionnairesArr.push(q);
//     }
//   }
//   var userid = "";
//   if(req.Type.includes("patient")){
//     userid = req.UserID;
//     let eq5 = {QuestionnaireID: 5, QuestionnaireText: "איכות חיים"};
//     let eq6 = {QuestionnaireID: 6, QuestionnaireText: "דירוג איכות חיים"};
//     questionnairesArr.push(eq5);
//     questionnairesArr.push(eq6);
//   }
//   else {
//     userid = req.body.UserID;
//     await User.updateOne({UserID: userid}, {changedQuestionnaires : req.body.changedQuestionnaires}, function (err, user) {
//       if (err)
//         common(res, err, err.message, null);
//       else {
//         if (user)
//           common(res, false, null, user.DateOfSurgery);
//         else
//           common(res, false, "Not Found", null);
//       }
//     });
//   }
//   await User.updateOne({UserID: userid}, {Questionnaires: questionnairesArr}, function (err, user) {
//     if (err)
//       common(res, err, err.message, null);
//     else {
//       if (user)
//         common(res, false, null, user.DateOfSurgery);
//       else
//         common(res, false, "Not Found", null);
//     }
//   });
// });

router.post('/changeUserQuestionnaire', async function(req, res) {
  let daily = {QuestionnaireID: 0, QuestionnaireText: "יומי"};
  let questionnairesArr = [daily];
  let Questionnaires = req.body.Questionnaires;
  if(Questionnaires.length>0){
    for await (const q of Questionnaires){
      if(q.QuestionnaireID==5){
        let eq6 = {QuestionnaireID: 6, QuestionnaireText: "דירוג איכות חיים"};
        if (!Questionnaires.some(questionnaire => questionnaire.QuestionnaireID === eq6.QuestionnaireID)) {
          questionnairesArr.push(eq6);
        }
      }
      questionnairesArr.push(q);
    }
  }
  var userid = req.UserID;
  if(req.Type.includes("doctor")){
    userid = req.body.UserID;
    await User.updateOne({UserID: userid}, {changedQuestionnaires : req.body.changedQuestionnaires}, function (err, user) {
      if (err)
        common(res, err, err.message, null);
      else {
        if (user)
          common(res, false, null, user.DateOfSurgery);
        else
          common(res, false, "Not Found", null);
      }
    });
  }
  await User.updateOne({UserID: userid}, {Questionnaires: questionnairesArr}, function (err, user) {
    if (err)
      common(res, err, err.message, null);
    else {
      if (user)
        common(res, false, null, user.DateOfSurgery);
      else
        common(res, false, "Not Found", null);
    }
  });
});


router.get('/getDateOfSurgery', async function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.query.UserID;
  await User.getUserByUserID(userid, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.DateOfSurgery);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.post('/changeDateOfSurgery', async function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else {
    userid = req.body.UserID;
    await User.updateOne({UserID: userid}, {changedSurgeryDate: req.body.changedSurgeryDate}, function (err, user) {
      if (err)
        common(res, err, err.message, null);
      else {
        if (user)
          common(res, false, null, user.DateOfSurgery);
        else
          common(res, false, "Not Found", null);
      }
    });
  }
    await User.updateOne({UserID: userid}, {DateOfSurgery: req.body.DateOfSurgery}, function (err, user) {
      if (err)
        common(res, err, err.message, null);
      else {
        if (user)
          common(res, false, null, user.DateOfSurgery);
        else
          common(res, false, "Not Found", null);
      }
    });
});


router.post('/askChangePassword', async function (req, res) {
  await User.getUserByUserID(req.UserID, function (err, user) {
    if (user) {
      var payload = {
        UserID: user.UserID, Type: user.Type
      };
      var options = {expiresIn: "300000ms"};
      var token = jwt.sign(payload, tempToken, options);
      common(res, err, err, token);
    }
    else {
      var error = {'message': 'User not exists'};
      common(res, error, error, null);
    }
  });
});


router.get('/userInfo', async function(req, res) {
  var userid = "";
  userid = req.UserID;
  let userObj = await User.findOne({UserID: req.UserID}).lean().exec();

  await User.getUserByUserID(userid, function (err, user) {
    if(err)
      common(res, true, err, null);
    else{
      if(user)
        common(res, false, null, user);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.post('/changeUserInfo', async function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.body.UserID;
  await User.updateOne({UserID: userid}, {Height: req.body.Height}, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.DateOfSurgery);
      else
        common(res, false, "Not Found", null);
    }
  });
});



router.put('/patientUpdate', async function (req, res) {
  await User.getUserByUserID(req.UserID, async function (err, user) {
    if (user) {
      user.UserID = req.body.UserID || user.UserID;
      user.First_Name = req.body.First_Name || user.First_Name;
      user.Last_Name = req.body.Last_Name || user.Last_Name;
      user.Phone_Number = req.body.Phone_Number || user.Phone_Number;
      user.Gender = req.body.Gender || user.Gender;
      user.Smoke = req.body.Smoke || user.Smoke;
      user.SurgeryType = req.body.SurgeryType || user.SurgeryType;
      user.Education = req.body.Education || user.Education;
      user.Height = req.body.Height || user.Height;
      user.Weight = req.body.Weight || user.Weight;
      user.BMI = req.body.BMI || user.BMI;
      user.BirthDate = (new Date(req.body.BirthDate || user.BirthDate)).setHours(0, 0, 0, 0);
      user.DateOfSurgery = req.body.DateOfSurgery;
      user.Type = ["patient"];
      user.ValidTime = req.body.ValidTime || user.ValidTime;
      user.Timestamp = new Date().getTime();
      await User.updateUser(user, function (error) {
        if(error)
          common(res, error, error, null);
        else
          common(res,false,null,user);
      });
    } else {
      var error = {'message': 'Taken Email'};
      common(res, error, error, null);
    }
  });
});

router.post('/patientUpdateAndroid', async function (req, res) {
  await User.getUserByUserID(req.UserID, async function (err, user) {
    if (user) {
      user.UserID = req.body.UserID || user.UserID;
      user.First_Name = req.body.First_Name || user.First_Name;
      user.Last_Name = req.body.Last_Name || user.Last_Name;
      user.Phone_Number = req.body.Phone_Number || user.Phone_Number;
      user.Gender = req.body.Gender || user.Gender;
      user.Smoke = req.body.Smoke || user.Smoke;
      user.SurgeryType = req.body.SurgeryType || user.SurgeryType;
      user.Education = req.body.Education || user.Education;
      user.Height = req.body.Height || user.Height;
      user.Weight = req.body.Weight || user.Weight;
      user.BMI = req.body.BMI || user.BMI;
      user.BirthDate = (new Date(req.body.BirthDate || user.BirthDate)).setHours(0, 0, 0, 0);
      // user.DateOfSurgery = req.body.DateOfSurgery;
      user.Type = ["patient"];
      user.changedSurgeryDate = req.body.changedSurgeryDate || user.changedSurgeryDate;
      user.changedQuestionnaires = req.body.changedQuestionnaires || user.changedQuestionnaires;
      user.Timestamp = new Date().getTime();
      await User.updateUser(user, function (error) {
        if(error)
          common(res, error, error, null);
        else
          common(res,false,null,user);
      });
    } else {
      var error = {'message': 'Taken Email'};
      common(res, error, error, null);
    }
  });
});


router.put('/doctorUpdate', async function (req, res) {
  await User.getUserByUserID(req.UserID, async function (err, user) {
    if (user) {
      user.UserID = req.body.UserID || user.UserID;
      user.First_Name = req.body.First_Name || user.First_Name;
      user.Last_Name = req.body.Last_Name || user.Last_Name;
      user.Phone_Number = req.body.Phone_Number || user.Phone_Number;
      user.BirthDate = (new Date(req.body.BirthDate || user.BirthDate)).setHours(0, 0, 0, 0);
      user.Type = ["doctor"];
      user.ValidTime = req.body.ValidTime || user.ValidTime;
      user.Timestamp = new Date().getTime();
      await User.updateUser(user, function (error) {
        if(error)
          common(res, error, error, null);
        else
          common(res,false,null,user);
      });
    } else {
      var error = {'message': 'Taken Email'};
      common(res, error, error, null);
    }
  });
});

router.get('/exercises', async function (req, res) {
  await Exercise.getExercises(function (err, exercise) {
    if(err)
      common(res, true, err, null);
    else
      common(res, false, null, exercise);
  });
});

router.get('/instructions', async function (req, res) {
  await Instruction.getInstructionsSurgery({},function (err, instruction) {
    if(err)
      common(res, true, err, null);
    else
      common(res, false, null, instruction);
  });
});

router.get(
    "/instructions/:id",
    asyncWrapper(async (req, res) => {
      const instruction = await getGridFSFiles(req.params.id);
      if (!instruction) {
        let err = { message: "Instruction not found" };
        common(res, err, err, null);
        return;
      }
      res.setHeader('Content-disposition', 'attachment; filename=' + instruction.filename);
      res.setHeader("content-type", instruction.contentType);
      const readStream = createGridFSReadStream(req.params.id);
      readStream.pipe(res);
    })
);

module.exports = router;

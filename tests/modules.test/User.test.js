const mongoose = require('mongoose');
const dbHandler = require('../db-handler');
const User = require('../../modules/User');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
var service = require('../../service.js');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Exercise test suite.
 */
describe('User tests ', () => {
    it('Create User', (done) => {
        const newUser = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        const callback = (err, createdUser) => {
            expect(err).toBeNull();
            expect(createdUser.UserID).toEqual("UserID");
            expect(createdUser.Password).toEqual(service.hashElement("Password"));
            expect(createdUser.First_Name).toEqual("First_Name");
            expect(createdUser.Last_Name).toEqual("Last_Name");
            expect(createdUser.Phone_Number).toEqual("Phone_Number");
            expect(createdUser.Gender).toEqual("Gender");
            expect(createdUser.Smoke).toEqual("Smoke");
            expect(createdUser.SurgeryType).toEqual("SurgeryType");
            expect(createdUser.Education).toEqual("Education");
            expect(createdUser.Height).toEqual(120);
            expect(createdUser.Weight).toEqual(55);
            expect(createdUser.BMI_NUMBER).toEqual(100);
            expect(createdUser.BMI).toEqual("100");
            expect(createdUser.BirthDate).toEqual(1620139890041);
            expect(createdUser.Type[0]).toEqual("patient");
            expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            expect(createdUser.Questionnaires.length).toEqual(0);
            expect(createdUser.VerificationQuestion).toEqual(1);
            expect(createdUser.VerificationAnswer).toEqual("2");
            expect(createdUser.ValidTime).toEqual(1620139890041);
            done();
        };
        User.createUser(newUser, callback);
    });


    it('Create extra User with same ID', (done) => {
        const newUser = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        const newUserSecond = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        const callback = (err, createdUser) => {
            expect(err).toBeNull();
            expect(createdUser.UserID).toEqual("UserID");
            expect(createdUser.Password).toEqual(service.hashElement("Password"));
            expect(createdUser.First_Name).toEqual("First_Name");
            expect(createdUser.Last_Name).toEqual("Last_Name");
            expect(createdUser.Phone_Number).toEqual("Phone_Number");
            expect(createdUser.Gender).toEqual("Gender");
            expect(createdUser.Smoke).toEqual("Smoke");
            expect(createdUser.SurgeryType).toEqual("SurgeryType");
            expect(createdUser.Education).toEqual("Education");
            expect(createdUser.Height).toEqual(120);
            expect(createdUser.Weight).toEqual(55);
            expect(createdUser.BMI_NUMBER).toEqual(100);
            expect(createdUser.BMI).toEqual("100");
            expect(createdUser.BirthDate).toEqual(1620139890041);
            expect(createdUser.Type[0]).toEqual("patient");
            expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            expect(createdUser.Questionnaires.length).toEqual(0);
            expect(createdUser.VerificationQuestion).toEqual(1);
            expect(createdUser.VerificationAnswer).toEqual("2");
            expect(createdUser.ValidTime).toEqual(1620139890041);
            User.createUser(newUserSecond, (err,createdUserSecond) => {
                expect(createdUserSecond).toBeUndefined()
                done();
            });
        };
        User.createUser(newUser, callback);
    });



    it('Get User By UserID - exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        User.createUser(newUser, (err,createdUser) => {
            expect(err).toBeNull();
            expect(createdUser.UserID).toEqual("UserID");
            expect(createdUser.Password).toEqual(service.hashElement("Password"));
            expect(createdUser.First_Name).toEqual("First_Name");
            expect(createdUser.Last_Name).toEqual("Last_Name");
            expect(createdUser.Phone_Number).toEqual("Phone_Number");
            expect(createdUser.Gender).toEqual("Gender");
            expect(createdUser.Smoke).toEqual("Smoke");
            expect(createdUser.SurgeryType).toEqual("SurgeryType");
            expect(createdUser.Education).toEqual("Education");
            expect(createdUser.Height).toEqual(120);
            expect(createdUser.Weight).toEqual(55);
            expect(createdUser.BMI_NUMBER).toEqual(100);
            expect(createdUser.BMI).toEqual("100");
            expect(createdUser.BirthDate).toEqual(1620139890041);
            expect(createdUser.Type[0]).toEqual("patient");
            expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            expect(createdUser.Questionnaires.length).toEqual(0);
            expect(createdUser.VerificationQuestion).toEqual(1);
            expect(createdUser.VerificationAnswer).toEqual("2");
            expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByUserID("UserID",(err, user) => {
                expect(err).toBeNull();
                expect(user.UserID).toEqual("UserID");
                expect(user.Password).toEqual(service.hashElement("Password"));
                expect(user.First_Name).toEqual("First_Name");
                expect(user.Last_Name).toEqual("Last_Name");
                expect(user.Phone_Number).toEqual("Phone_Number");
                expect(user.Gender).toEqual("Gender");
                expect(user.Smoke).toEqual("Smoke");
                expect(user.SurgeryType).toEqual("SurgeryType");
                expect(user.Education).toEqual("Education");
                expect(user.Height).toEqual(120);
                expect(user.Weight).toEqual(55);
                expect(user.BMI_NUMBER).toEqual(100);
                expect(user.BMI).toEqual("100");
                expect(user.BirthDate).toEqual(1620139890041);
                expect(user.Type[0]).toEqual("patient");
                expect(user.DateOfSurgery).toEqual(1620139890041);
                expect(user.Questionnaires.length).toEqual(0);
                expect(user.VerificationQuestion).toEqual(1);
                expect(user.VerificationAnswer).toEqual("2");
                expect(user.ValidTime).toEqual(1620139890041);
                done();
            });
        });
    });


    it('Get User By UserID - Not exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        User.createUser(newUser, (err,createdUser) => {
            expect(err).toBeNull();
            expect(createdUser.UserID).toEqual("UserID");
            expect(createdUser.Password).toEqual(service.hashElement("Password"));
            expect(createdUser.First_Name).toEqual("First_Name");
            expect(createdUser.Last_Name).toEqual("Last_Name");
            expect(createdUser.Phone_Number).toEqual("Phone_Number");
            expect(createdUser.Gender).toEqual("Gender");
            expect(createdUser.Smoke).toEqual("Smoke");
            expect(createdUser.SurgeryType).toEqual("SurgeryType");
            expect(createdUser.Education).toEqual("Education");
            expect(createdUser.Height).toEqual(120);
            expect(createdUser.Weight).toEqual(55);
            expect(createdUser.BMI_NUMBER).toEqual(100);
            expect(createdUser.BMI).toEqual("100");
            expect(createdUser.BirthDate).toEqual(1620139890041);
            expect(createdUser.Type[0]).toEqual("patient");
            expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            expect(createdUser.Questionnaires.length).toEqual(0);
            expect(createdUser.VerificationQuestion).toEqual(1);
            expect(createdUser.VerificationAnswer).toEqual("2");
            expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByUserID("UserIDNotExists",(err, user) => {
                expect(err).toBeNull();
                expect(user).toBeNull();
                done()
            });
        });
    });
    it('Get User By Name - exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        User.createUser(newUser, (err,createdUser) => {
            expect(err).toBeNull();
            expect(createdUser.UserID).toEqual("UserID");
            expect(createdUser.Password).toEqual(service.hashElement("Password"));
            expect(createdUser.First_Name).toEqual("First_Name");
            expect(createdUser.Last_Name).toEqual("Last_Name");
            expect(createdUser.Phone_Number).toEqual("Phone_Number");
            expect(createdUser.Gender).toEqual("Gender");
            expect(createdUser.Smoke).toEqual("Smoke");
            expect(createdUser.SurgeryType).toEqual("SurgeryType");
            expect(createdUser.Education).toEqual("Education");
            expect(createdUser.Height).toEqual(120);
            expect(createdUser.Weight).toEqual(55);
            expect(createdUser.BMI_NUMBER).toEqual(100);
            expect(createdUser.BMI).toEqual("100");
            expect(createdUser.BirthDate).toEqual(1620139890041);
            expect(createdUser.Type[0]).toEqual("patient");
            expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            expect(createdUser.Questionnaires.length).toEqual(0);
            expect(createdUser.VerificationQuestion).toEqual(1);
            expect(createdUser.VerificationAnswer).toEqual("2");
            expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByName("First_Name","Last_Name",["patient"],(err, user) => {
                expect(err).toBeNull();
                expect(user[0].UserID).toEqual("UserID");
                expect(user[0].Password).toEqual(service.hashElement("Password"));
                expect(user[0].First_Name).toEqual("First_Name");
                expect(user[0].Last_Name).toEqual("Last_Name");
                expect(user[0].Phone_Number).toEqual("Phone_Number");
                expect(user[0].Gender).toEqual("Gender");
                expect(user[0].Smoke).toEqual("Smoke");
                expect(user[0].SurgeryType).toEqual("SurgeryType");
                expect(user[0].Education).toEqual("Education");
                expect(user[0].Height).toEqual(120);
                expect(user[0].Weight).toEqual(55);
                expect(user[0].BMI_NUMBER).toEqual(100);
                expect(user[0].BMI).toEqual("100");
                expect(user[0].BirthDate).toEqual(1620139890041);
                expect(user[0].Type[0]).toEqual("patient");
                expect(user[0].DateOfSurgery).toEqual(1620139890041);
                expect(user[0].Questionnaires.length).toEqual(0);
                expect(user[0].VerificationQuestion).toEqual(1);
                expect(user[0].VerificationAnswer).toEqual("2");
                expect(user[0].ValidTime).toEqual(1620139890041);
                done();
            });
        });
    });
    it('Get User By UserID - Not exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        User.createUser(newUser, (err,createdUser) => {
            expect(err).toBeNull();
            expect(createdUser.UserID).toEqual("UserID");
            expect(createdUser.Password).toEqual(service.hashElement("Password"));
            expect(createdUser.First_Name).toEqual("First_Name");
            expect(createdUser.Last_Name).toEqual("Last_Name");
            expect(createdUser.Phone_Number).toEqual("Phone_Number");
            expect(createdUser.Gender).toEqual("Gender");
            expect(createdUser.Smoke).toEqual("Smoke");
            expect(createdUser.SurgeryType).toEqual("SurgeryType");
            expect(createdUser.Education).toEqual("Education");
            expect(createdUser.Height).toEqual(120);
            expect(createdUser.Weight).toEqual(55);
            expect(createdUser.BMI_NUMBER).toEqual(100);
            expect(createdUser.BMI).toEqual("100");
            expect(createdUser.BirthDate).toEqual(1620139890041);
            expect(createdUser.Type[0]).toEqual("patient");
            expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            expect(createdUser.Questionnaires.length).toEqual(0);
            expect(createdUser.VerificationQuestion).toEqual(1);
            expect(createdUser.VerificationAnswer).toEqual("2");
            expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByName("UserNotExists","Last_Name","patient", (err, user) => {
                expect(err).toBeNull();
                expect(user.length).toEqual(0);
                done()
            });
        });
    });

    it('Get User By UserID - exists user', (done) => {
        const newUser = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });

        const updatedUser = new User({
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 180,
            Weight: 66,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        User.createUser(newUser, (err,createdUser) => {
            expect(err).toBeNull();
            expect(createdUser.UserID).toEqual("UserID");
            expect(createdUser.Password).toEqual(service.hashElement("Password"));
            expect(createdUser.First_Name).toEqual("First_Name");
            expect(createdUser.Last_Name).toEqual("Last_Name");
            expect(createdUser.Phone_Number).toEqual("Phone_Number");
            expect(createdUser.Gender).toEqual("Gender");
            expect(createdUser.Smoke).toEqual("Smoke");
            expect(createdUser.SurgeryType).toEqual("SurgeryType");
            expect(createdUser.Education).toEqual("Education");
            expect(createdUser.Height).toEqual(120);
            expect(createdUser.Weight).toEqual(55);
            expect(createdUser.BMI_NUMBER).toEqual(100);
            expect(createdUser.BMI).toEqual("100");
            expect(createdUser.BirthDate).toEqual(1620139890041);
            expect(createdUser.Type[0]).toEqual("patient");
            expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            expect(createdUser.Questionnaires.length).toEqual(0);
            expect(createdUser.VerificationQuestion).toEqual(1);
            expect(createdUser.VerificationAnswer).toEqual("2");
            expect(createdUser.ValidTime).toEqual(1620139890041);
            User.updateUser(updatedUser,(err, user) => {
                expect(err).toBeNull();
                expect(user.First_Name).toEqual("First_Name");
                expect(user.Last_Name).toEqual("Last_Name");
                expect(user.Phone_Number).toEqual("Phone_Number");
                expect(user.Gender).toEqual("Gender");
                expect(user.Smoke).toEqual("Smoke");
                expect(user.SurgeryType).toEqual("SurgeryType");
                expect(user.Education).toEqual("Education");
                expect(user.Height).toEqual(180);
                expect(user.Weight).toEqual(66);
                expect(user.BMI_NUMBER).toEqual(100);
                expect(user.BMI).toEqual("100");
                expect(user.BirthDate).toEqual(1620139890041);
                expect(user.Type[0]).toEqual("patient");
                expect(user.DateOfSurgery).toEqual(1620139890041);
                expect(user.Questionnaires.length).toEqual(0);
                expect(user.VerificationQuestion).toEqual(1);
                expect(user.VerificationAnswer).toEqual("2");
                expect(user.ValidTime).toEqual(1620139890041);
                done();
            });
        });
    });


    it('Change Password', (done) => {
        const newUser = new User({
            UserID: "UserID",
            Password: service.hashElement("Password"),
            First_Name: "First_Name",
            Last_Name: "Last_Name",
            Phone_Number: "Phone_Number",
            Gender: "Gender",
            Smoke: "Smoke",
            SurgeryType: "SurgeryType",
            Education: "Education",
            Height: 120,
            Weight: 55,
            BMI: "100",
            BMI_NUMBER: 100,
            BirthDate: 1620139890041,
            Type: ["patient"],
            DateOfSurgery: 1620139890041,
            Questionnaires: [],
            VerificationQuestion: 1,
            VerificationAnswer: 2,
            ValidTime: 1620139890041,
            Timestamp: new Date().getTime(),
            changedSurgeryDate: false,
            changedQuestionnaires: false
        });
        User.createUser(newUser, (err,createdUser) => {
            expect(err).toBeNull();
            expect(createdUser.UserID).toEqual("UserID");
            expect(createdUser.Password).toEqual(service.hashElement("Password"));
            expect(createdUser.First_Name).toEqual("First_Name");
            expect(createdUser.Last_Name).toEqual("Last_Name");
            expect(createdUser.Phone_Number).toEqual("Phone_Number");
            expect(createdUser.Gender).toEqual("Gender");
            expect(createdUser.Smoke).toEqual("Smoke");
            expect(createdUser.SurgeryType).toEqual("SurgeryType");
            expect(createdUser.Education).toEqual("Education");
            expect(createdUser.Height).toEqual(120);
            expect(createdUser.Weight).toEqual(55);
            expect(createdUser.BMI_NUMBER).toEqual(100);
            expect(createdUser.BMI).toEqual("100");
            expect(createdUser.BirthDate).toEqual(1620139890041);
            expect(createdUser.Type[0]).toEqual("patient");
            expect(createdUser.DateOfSurgery).toEqual(1620139890041);
            expect(createdUser.Questionnaires.length).toEqual(0);
            expect(createdUser.VerificationQuestion).toEqual(1);
            expect(createdUser.VerificationAnswer).toEqual("2");
            expect(createdUser.ValidTime).toEqual(1620139890041);
            User.getUserByUserID("UserID",(err, user) => {
                expect(err).toBeNull();
                expect(user.UserID).toEqual("UserID");
                expect(user.Password).toEqual(service.hashElement("Password"));
                User.changePassword(user,"PasswordNew", (err,userNewPass) =>{
                    expect(err).toBeNull();
                    expect(user.UserID).toEqual("UserID");
                    expect(user.Password).toEqual(service.hashElement("PasswordNew"))
                    done();
                });
            });
        });
    });

});
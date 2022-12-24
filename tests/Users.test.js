const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
const User = require('../modules/User');
const service = require('../service.js');

require('dotenv').config();
const supertest = require('supertest');
let app;
let request;

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect();
    app = require('../app');
    request = supertest(app)
});

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
describe('Users tests ', () => {
    it('Register - patient', (done) => {
        request.post('/users/patientRegister')
            .send({
                UserID: "UserID",
                Password: "Password",
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
                Code:"soroka372abc",
                Type: ["patient"],
                DateOfSurgery: 1620139890041,
                Questionnaires: [],
                VerificationQuestion: 1,
                VerificationAnswer: 2,
                ValidTime: 1620139890041,
                Timestamp: new Date().getTime(),
                changedSurgeryDate: false,
                changedQuestionnaires: false
            })
            .expect(200)
            .then(res => {
                // expect(res.body.message).toEqual("User not exists");
                expect(res.body.error).toBeFalsy();
                expect(res.body.data.UserID).toEqual(service.hashElement("UserID"));
                expect(res.body.data.Password).toEqual(service.hashElement("Password"));
                expect(res.body.data.First_Name).toEqual("First_Name");
                expect(res.body.data.Last_Name).toEqual("Last_Name");
                expect(res.body.data.Phone_Number).toEqual("Phone_Number");
                expect(res.body.data.Gender).toEqual("Gender");
                expect(res.body.data.Smoke).toEqual("Smoke");
                expect(res.body.data.SurgeryType).toEqual("SurgeryType");
                expect(res.body.data.Education).toEqual("Education");
                expect(res.body.data.Height).toEqual(120);
                expect(res.body.data.Weight).toEqual(55);
                expect(res.body.data.BMI_NUMBER).toEqual(100);
                expect(res.body.data.BMI).toEqual("100");
                expect(res.body.data.BirthDate).toEqual((new Date(1620139890041)).setHours(0, 0, 0, 0));
                expect(res.body.data.Type[0]).toEqual("patient");
                expect(res.body.data.DateOfSurgery).toEqual(1620139890041);
                expect(res.body.data.Questionnaires.length).toEqual(3);
                expect(res.body.data.VerificationQuestion).toEqual(1);
                expect(res.body.data.VerificationAnswer).toEqual("2");
                expect(res.body.data.ValidTime).toEqual(1620139890041);
                done();
            });
    });
    it('Register - doctor', (done) => {
        request.post('/users/doctorRegister')
            .send({
                UserID: "UserID",
                Password: "Password",
                First_Name: "First_Name",
                Last_Name: "Last_Name",
                Phone_Number: "Phone_Number",
                BirthDate: 1620139890041,
                Code:"soroka93xyz",
                Type: ["doctor"],
                VerificationQuestion: 1,
                VerificationAnswer: 2,
                ValidTime: 1620139890041,
                Timestamp: new Date().getTime(),
            })
            .expect(200)
            .then(res => {
                // expect(res.body.message).toEqual("User not exists");
                expect(res.body.error).toBeFalsy();
                expect(res.body.data.UserID).toEqual(service.hashElement("UserID"));
                expect(res.body.data.Password).toEqual(service.hashElement("Password"));
                expect(res.body.data.First_Name).toEqual("First_Name");
                expect(res.body.data.Last_Name).toEqual("Last_Name");
                expect(res.body.data.Phone_Number).toEqual("Phone_Number");
                expect(res.body.data.BirthDate).toEqual((new Date(1620139890041)).setHours(0, 0, 0, 0));
                expect(res.body.data.Type[0]).toEqual("doctor");
                expect(res.body.data.VerificationQuestion).toEqual(1);
                expect(res.body.data.VerificationAnswer).toEqual("2");
                expect(res.body.data.ValidTime).toEqual(1620139890041);
                done();
            });
    });
    it('Login with invalid credentials', (done) => {
        request.post('/users/login')
            .send({UserID: 'invalid', Password: 'invalid'})
            .expect(200)
            .then(res => {
                expect(res.body.message).toEqual("User not exists");
                expect(res.body.error).toBeTruthy();
                expect(res.body.data).toBeNull();
                done();
            });
    });

    it('Login with valid credentials', (done) => {
        const newUser = new User({
            // UserID: "UserID",
            // Password: "Password",
            UserID: service.hashElement("UserID"),
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
            request.post('/users/login')
                .send({UserID: "UserID", Password: "Password"})
                .expect(200)
                .then(res => {
                    expect(res.body.data.name).toEqual("First_Name Last_Name");
                    expect(res.body.data.type[0]).toEqual("patient");
                    expect(res.body.error).toBeFalsy();
                    done();
                });
        });
    });

    it('forgotPassword', (done) => {
        const newUser = new User({
            // UserID: "UserID",
            // Password: "Password",
            UserID: service.hashElement("UserID"),
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
            request.post('/users/forgotPassword')
                .send({UserID: "UserID"})
                .expect(200)
                .then(res => {
                    console.log(res.body.data)
                    console.log(res.body.error)
                    expect(res.body.data).toEqual(1);
                    expect(res.body.error).toBeFalsy();
                    done();
                });
        });
    });
});
const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
const User = require('../modules/User');
const service = require('../service.js');
const Exercise = require('../modules/Exercise');

require('dotenv').config();
const supertest = require('supertest');
let app;
let request;

/**
 * Connect to a new in-memory database before running any tests.
 */
const userIdHash = service.hashElement("UserID");
const patientIdHash = service.hashElement("patientID");


let token;
beforeAll(async (done) => {
    await dbHandler.connect();
    app = require('../app');
    request = supertest(app);
    const newUser = new User({
        UserID: userIdHash,
        Password: service.hashElement("Password"),
        First_Name: "First_Name",
        Last_Name: "Last_Name",
        Phone_Number: "Phone_Number",
        BirthDate: 1620139890041,
        Type: ["doctor"],
        VerificationQuestion: 1,
        VerificationAnswer: 2,
        ValidTime: 1620139890041,
        Timestamp: new Date().getTime(),
    });
    const newUserPatient = new User({
        UserID: patientIdHash,
        Password: service.hashElement("Password"),
        First_Name: "First_Name",
        Last_Name: "Last_Name",
        Phone_Number: "Phone_Number",
        Gender: "נקבה",
        Smoke: "מעשן",
        SurgeryType: "ניתוח מתוכנן",
        Education: "6-9 שנות לימוד",
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
    User.createUser(newUserPatient, () => {
        User.createUser(newUser, () => {
            request.post('/users/login')
                .send({UserID: "UserID", Password: "Password"})
                .expect(200)
                .then(res => {
                    token = res.body.data.token;
                    done();
                });
        });
    });
});

describe('tests doctor Exercises', () => {
    it('post Exercise', (done) => {
        request.post('/auth/doctors/exercises')
            .send({Category :'Category',
                Video : 'Video'})
            .set('Content-Type', 'application/json')
            .set('x-auth-token', token)
            .then(res => {
                let obj = JSON.parse(res.text);
                expect(obj.data.ExerciseId.length).toBeGreaterThanOrEqual(0);
                expect(obj.error).toBeFalsy();
                done();
            });
    })

    it('Delete exercise', (done) => {
        const exerciseToCreate = new Exercise({
            ExerciseId :"ExerciseId",
            Category :'Category',
            Video : 'Video'
        });
        exerciseToCreate.save((function (error) {
            expect(error).toBeNull();
            request.delete('/auth/doctors/exercises/removeExercise/ExerciseId')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    console.log(obj)
                    expect(obj.error).toBeFalsy();
                    expect(obj.data).toEqual({});
                    done();
                });
        }))
    })
});
/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());
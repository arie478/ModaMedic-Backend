const mongoose = require('mongoose');
const dbHandler = require('./db-handler');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");
const User = require('../modules/User');
const service = require('../service.js');
const StepsMetric = require('../modules/Metrics').StepsMetric;
const SleepMetric = require('../modules/Metrics').SleepMetric;
const DistanceMetric = require('../modules/Metrics').DistanceMetric;
const CaloriesMetric = require('../modules/Metrics').CaloriesMetric;
const AccelerometerMetric = require('../modules/Metrics').AccelerometerMetric;
const WeatherMetric = require('../modules/Metrics').WeatherMetric;
const ActivityMetric = require('../modules/Metrics').ActivityMetric;
var DailyAnswer = require('../modules/Answer').DailyAnswer;
var PeriodicAnswer = require('../modules/Answer').PeriodicAnswer;

require('dotenv').config();
const supertest = require('supertest');
let app;
let request;

/**
 * Connect to a new in-memory database before running any tests.
 */
const userIdHash = service.hashElement("UserID");
let token;
beforeAll(async (done) => {
    await dbHandler.connect();
    app = require('../app');
    request = supertest(app);
    const newUser = new User({
        // UserID: "UserID",
        // Password: "Password",
        UserID: userIdHash,
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
    console.log(newUser.UserID)
    console.log(newUser.Password)
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

describe('tests metrics', () => {
   it('Get steps', (done) => {
       let newMetric = new StepsMetric({
           UserID: userIdHash,
           Timestamp: '1585687850376',
           ValidTime: '1585687872508',
           Data: 100
       });
       newMetric.save(function (error) {
           expect(error).toBeNull();
           const query = {
               start_time: '1577836800000',
               end_time: '1596326400000'
           };
           request.get('/auth/patients/metrics/getSteps')
               .set('Content-Type', 'application/json')
               .set('x-auth-token', token)
               .query(query)
               .then(res => {
                   let obj = JSON.parse(res.text)
                   expect(obj.data[0].docs[0].UserID).toEqual(userIdHash);
                   expect(obj.data[0].docs[0].Data).toEqual(100);
                   expect(obj.data[0].docs[0].Timestamp).toEqual(1585687850376);
                   done();
               });
       });
   })
    it('Get sleep', (done) => {
        let newMetric = new SleepMetric({
            UserID: userIdHash,
            Timestamp: '1585687850376',
            ValidTime: '1585687872508',
            Data: [{
                StartTime: 1620489253000,
                EndTime: 1620489257000,
                State: "SLEEP_LIGHT"
            }]
        });
        newMetric.save(function (error) {
            expect(error).toBeNull();
            const query = {
                start_time: '1577836800000',
                end_time: '1620575661000'
            };
            request.get('/auth/patients/metrics/getSleep')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    console.log(res.text)
                    expect(obj.data[0].docs[0].UserID).toEqual(userIdHash);
                    expect(obj.data[0].docs[0].Data[0].State).toEqual("SLEEP_LIGHT");
                    expect(obj.data[0].docs[0].Data[0].StartTime).toEqual(1620489253000);
                    expect(obj.data[0].docs[0].Data[0].EndTime).toEqual(1620489257000);
                    expect(obj.data[0].docs[0].Timestamp).toEqual(1585687850376);
                    done();
                });
        });
    })
    it('Get distance', (done) => {
        let newMetric = new DistanceMetric({
            UserID: userIdHash,
            Timestamp: '1585687850376',
            ValidTime: '1585687872508',
            Data: 100
        });
        newMetric.save(function (error) {
            expect(error).toBeNull();
            const query = {
                start_time: '1577836800000',
                end_time: '1596326400000'
            };
            request.get('/auth/patients/metrics/getDistance')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    expect(obj.data[0].docs[0].UserID).toEqual(userIdHash);
                    expect(obj.data[0].docs[0].Data).toEqual(100);
                    expect(obj.data[0].docs[0].Timestamp).toEqual(1585687850376);
                    done();
                });
        });
    })
    it('Get calories', (done) => {
        let newMetric = new CaloriesMetric({
            UserID: userIdHash,
            Timestamp: '1585687850376',
            ValidTime: '1585687872508',
            Data: 100
        });
        newMetric.save(function (error) {
            expect(error).toBeNull();
            const query = {
                start_time: '1577836800000',
                end_time: '1596326400000'
            };
            request.get('/auth/patients/metrics/getCalories')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    expect(obj.data[0].docs[0].UserID).toEqual(userIdHash);
                    expect(obj.data[0].docs[0].Data).toEqual(100);
                    expect(obj.data[0].docs[0].Timestamp).toEqual(1585687850376);
                    done();
                });
        });
    })
    it('Get WeatherMetric', (done) => {
        let newMetric = new WeatherMetric({
            UserID: userIdHash,
            Timestamp: '1585687850376',
            ValidTime: '1585687872508',
            Data: {
                High: 30,
                Low: 17,
                Humidity: 20
            }
        });
        newMetric.save(function (error) {
            expect(error).toBeNull();
            const query = {
                start_time: '1577836800000',
                end_time: '1596326400000'
            };
            request.get('/auth/patients/metrics/getWeather')
                .set('Content-Type', 'application/json')
                .set('x-auth-token', token)
                .query(query)
                .then(res => {
                    let obj = JSON.parse(res.text)
                    console.log(obj)
                    expect(obj.data[0].docs[0].UserID).toEqual(userIdHash);
                    expect(obj.data[0].docs[0].Data.High).toEqual(30);
                    expect(obj.data[0].docs[0].Data.Low).toEqual(17);
                    expect(obj.data[0].docs[0].Data.Humidity).toEqual(20);
                    expect(obj.data[0].docs[0].Timestamp).toEqual(1585687850376);
                    done();
                });
        });
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
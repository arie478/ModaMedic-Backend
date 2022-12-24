const mongoose = require('mongoose');
const dbHandler = require('../db-handler');
const Verification = require('../../modules/Verification');
const {beforeAll, it, afterAll, afterEach, expect, describe} = require("@jest/globals");

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
 * Verification test suite.
 */
describe('Verification tests ', () => {

    it('Create verification', (done) => {
        const verificationToCreate = new Verification({
            QuestionID: 0,
            QuestionText: "QuestionText"
        });
        const callback = (err, createdVerification) => {
            expect(err).toBeNull();
            expect(createdVerification.QuestionID).toEqual(0);
            expect(createdVerification.QuestionText).toEqual("QuestionText");
            done();
        };
        Verification.createVerification(verificationToCreate, callback);
    });
    it('Create verification same ID', (done) => {
        const verificationToCreate = new Verification({
            QuestionID: 0,
            QuestionText: "QuestionText"
        });
        const verificationToCreateSecond = new Verification({
            QuestionID: 0,
            QuestionText: "QuestionText"
        });
        const callback = (err, createdVerification) => {
            expect(err).toBeNull();
            expect(createdVerification.QuestionID).toEqual(0);
            expect(createdVerification.QuestionText).toEqual("QuestionText");
            Verification.createVerification(verificationToCreateSecond, (err,createdExerciseSecond) => {
                expect(createdExerciseSecond).toBeUndefined()
            done();
            });
        };
        Verification.createVerification(verificationToCreate, callback);
    });


    it('Get one verification', (done) => {
        const verificationToCreate = new Verification({
            QuestionID: 0,
            QuestionText: "QuestionText"
        });

        Verification.createVerification(verificationToCreate, (err, createdVerification) => {
            expect(err).toBeNull();
            expect(createdVerification.QuestionID).toEqual(0);
            expect(createdVerification.QuestionText).toEqual("QuestionText");
            Verification.getOneVerification(0,(err, verification) => {
                expect(err).toBeNull();
                expect(verification.QuestionID).toEqual(0);
                expect(verification.QuestionText).toEqual("QuestionText");
                done();
            });
        });
    });

    it('Get one verification - not exist question\'s id', (done) => {
        const verificationToCreate = new Verification({
            QuestionID: 0,
            QuestionText: "QuestionText"
        });

        Verification.createVerification(verificationToCreate, (err, createdVerification) => {
            expect(err).toBeNull();
            expect(createdVerification.QuestionID).toEqual(0);
            expect(createdVerification.QuestionText).toEqual("QuestionText");
            Verification.getOneVerification(1,(err, verification) => {
                expect(verification).toBeNull
                done();
            });
        });
    });


    it('Get all verifications', (done) => {
        const verificationToCreate = new Verification({
            QuestionID: 0,
            QuestionText: "QuestionText"
        });
        const verificationToCreateSecond = new Verification({
            QuestionID: 1,
            QuestionText: "QuestionTextSecond"
        });

        Verification.createVerification(verificationToCreate, (err, createdVerification) => {
            expect(err).toBeNull();
            expect(createdVerification.QuestionID).toEqual(0);
            expect(createdVerification.QuestionText).toEqual("QuestionText");
            Verification.createVerification(verificationToCreateSecond, (err, createdVerificationSecond) => {
                expect(err).toBeNull();
                expect(createdVerificationSecond.QuestionID).toEqual(1);
                expect(createdVerificationSecond.QuestionText).toEqual("QuestionTextSecond");
                Verification.getAllVerification((err, verifications) => {
                    expect(err).toBeNull();
                    expect(verifications[0].QuestionID).toEqual(0);
                    expect(verifications[0].QuestionText).toEqual("QuestionText");
                    expect(verifications[1].QuestionID).toEqual(1);
                    expect(verifications[1].QuestionText).toEqual("QuestionTextSecond");
                    done();
                });
            });
        });
    });
});

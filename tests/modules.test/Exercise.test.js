const mongoose = require('mongoose');
const dbHandler = require('../db-handler');
const Exercise = require('../../modules/Exercise');
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
 * Exercise test suite.
 */
describe('Exercise tests ', () => {

    it('Create exercise', (done) => {
        const exerciseToCreate = new Exercise({
            ExerciseId: "ExerciseId",
            Category: "Category",
            Video : "Video"
        });
        const callback = (err, createdExercise) => {
            expect(err).toBeNull();
            expect(createdExercise.ExerciseId).toEqual("ExerciseId");
            expect(createdExercise.Category).toEqual("Category");
            expect(createdExercise.Video).toEqual("Video");
            done();
        };
        Exercise.createExercise(exerciseToCreate, callback);
    });

    it('Create extra Exercise with same ID', (done) => {
        const newExercise = new Exercise({
            ExerciseId: "ExerciseId",
            Category: "Category",
            Video : "Video"
        });
        const newExerciseSecond = new Exercise({
            ExerciseId: "ExerciseId",
            Category: "Category",
            Video : "Video"
        });

        const callback = (err, createdExercise) => {
            expect(err).toBeNull();
            expect(createdExercise.ExerciseId).toEqual("ExerciseId");
            expect(createdExercise.Category).toEqual("Category");
            expect(createdExercise.Video).toEqual("Video");
            Exercise .createExercise(newExerciseSecond, (err,createdExerciseSecond) => {
                expect(createdExerciseSecond).toBeUndefined()
                done();
            });
        };
        Exercise.createExercise(newExercise, callback);
    });
    it('Get exercises', (done) => {
        const exerciseToCreate = new Exercise({
            ExerciseId: "ExerciseId",
            Category: "Category",
            Video : "Video"
        });

        Exercise.createExercise(exerciseToCreate, (err, createdExercise) => {
            expect(err).toBeNull();
            expect(createdExercise.ExerciseId).toEqual("ExerciseId");
            expect(createdExercise.Category).toEqual("Category");
            expect(createdExercise.Video).toEqual("Video");

            Exercise.getExercises((err, exercises) => {
                expect(err).toBeNull();
                expect(exercises.length).toEqual(1);
                expect(exercises[0].ExerciseId).toEqual("ExerciseId");
                expect(exercises[0].Category).toEqual("Category");
                expect(exercises[0].Video).toEqual("Video");
                done();
            });
        });
    });

    it('Get exercises - empty', (done) => {
        Exercise.getExercises((err, exercises) => {
            expect(err).toBeNull();
            expect(exercises.length).toEqual(0);
            done();
        });
    });
    it('Delete exist exercise', (done) => {
        const exerciseToCreate = new Exercise({
            ExerciseId: "ExerciseId",
            Category: "Category",
            Video : "Video"
        });
        Exercise.createExercise(exerciseToCreate, (err, createdExercise) => {
            expect(err).toBeNull();
            expect(createdExercise.ExerciseId).toEqual("ExerciseId");
            expect(createdExercise.Category).toEqual("Category");
            expect(createdExercise.Video).toEqual("Video");
            Exercise.getExercises((err, exercises) => {
                expect(err).toBeNull();
                expect(exercises.length).toEqual(1);
                expect(exercises[0].ExerciseId).toEqual("ExerciseId");
                expect(exercises[0].Category).toEqual("Category");
                expect(exercises[0].Video).toEqual("Video");
                Exercise.removeExercise(exerciseToCreate.ExerciseId,(err, exercises) => {
                    expect(err).toBeNull();
                    expect(exercises.deletedCount).toEqual(1);
                    done();
                });
            });

        });
    });
    it('Delete not exist exercise', (done) => {
        Exercise.removeExercise("NoId",(err, exercises) => {
            expect(err).toBeNull();
            expect(exercises.deletedCount).toEqual(0);
            done();
        });
    });
});
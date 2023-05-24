const mongoose = require('mongoose');
const dbHandler = require('../db-handler');
const Questionnaire = require('../../modules/Questionnaire');
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
describe('Questionnaire tests ', () => {
    it('Get questionnaire - exists questionnaire', (done) => {
        const questionnaireToCreate = new Questionnaire({
            QuestionnaireID : 0,
            QuestionnaireText : "יומי",
            QuestionnaireEnglishText : "Daily",
            Questions : [
                {
                    QuestionID : 0,
                    QuestionText:"מהי רמת הכאב המקסימלית שחווית היום?",
                    Type:"VAS",
                    Best:"אין כאב בכלל",
                    Worst:"כאב בלתי נסבל",
                    Answers:
                        [
                            {
                                answerID: 0,
                                answerText: "0"
                            },
                            {
                                answerID: 1,
                                answerText: "1"
                            },
                            {
                                answerID: 2,
                                answerText: "2"
                            },
                            {
                                answerID: 3,
                                answerText: "3"
                            },
                            {
                                answerID: 4,
                                answerText: "4"
                            },
                            {
                                answerID: 5,
                                answerText: "5"
                            },
                            {
                                answerID: 6,
                                answerText: "6"
                            },
                            {
                                answerID: 7,
                                answerText: "7"
                            },
                            {
                                answerID: 8,
                                answerText: "8"
                            },
                            {
                                answerID: 9,
                                answerText: "9"
                            },
                            {
                                answerID: 10,
                                answerText: "10"
                            }
                        ]
                },
                {
                    QuestionID : 1,
                    QuestionText:"איזה סוג תרופה נטלת היום?",
                    Type:"multi",
                    Alone : [0],
                    Answers :
                        [
                            {
                                answerID: 0,
                                answerText: "לא נטלתי"
                            },
                            {	answerID : 1,
                                answerText : "בסיסית"
                            },
                            {	answerID : 2,
                                answerText : "מתקדמת"
                            },
                            {	answerID : 3,
                                answerText : "נרקוטית"
                            }
                        ]
                }
            ]
        });

        Questionnaire.createQuestionnaire(questionnaireToCreate, (err, createdQuestionnaire) => {
            expect(err).toBeNull();
            expect(createdQuestionnaire.QuestionnaireID).toEqual(0);
            expect(createdQuestionnaire.QuestionnaireText).toEqual("יומי");
            Questionnaire.getQuestionnaire("0",(err, questionaire) => {
                expect(err).toBeNull();
                expect(questionaire.QuestionnaireID).toEqual(0);
                done();
            });
        });
    });


    it('Get questionnaire - not exists questionnaire', (done) => {
        Questionnaire.getQuestionnaire("0",(err, questionaire) => {
            expect(err).toBeNull();
            expect(questionaire).toBeNull();
            done();
        });
    });
});

const mongoose = require('mongoose');
const dbHandler = require('../db-handler');
const Message = require('../../modules/Message');
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
describe('Message tests ', () => {

    it('Create exercise', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });
        const callback = (err, createdMessage) => {
            expect(err).toBeNull();
            expect(createdMessage.MessageId).toEqual("MessageId");
            expect(createdMessage.From).toEqual("From");
            expect(createdMessage.To).toEqual("To");
            expect(createdMessage.Content).toEqual("Content");
            expect(createdMessage.Date).toEqual(1620139890041);
            expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            expect(createdMessage.FromLastName).toEqual("FromLastName");
            done();
        };
        Message.createMessage(messageToCreate, callback);
    });
    it('Get messages - exists user', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });

        Message.createMessage(messageToCreate, (err, createdMessage) => {
            expect(err).toBeNull();
            expect(createdMessage.MessageId).toEqual("MessageId");
            expect(createdMessage.From).toEqual("From");
            expect(createdMessage.To).toEqual("To");
            expect(createdMessage.Content).toEqual("Content");
            expect(createdMessage.Date).toEqual(1620139890041);
            expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            expect(createdMessage.FromLastName).toEqual("FromLastName");
            Message.getUserMessages("To",(err, messages) => {
                expect(err).toBeNull();
                expect(messages.length).toEqual(1);
                done();
            });
        });
    });

    it('Get messages - not exists user', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });

        Message.createMessage(messageToCreate, (err, createdMessage) => {
            expect(err).toBeNull();
            expect(createdMessage.MessageId).toEqual("MessageId");
            expect(createdMessage.From).toEqual("From");
            expect(createdMessage.To).toEqual("To");
            expect(createdMessage.Content).toEqual("Content");
            expect(createdMessage.Date).toEqual(1620139890041);
            expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            expect(createdMessage.FromLastName).toEqual("FromLastName");
            Message.getUserMessages("NotExist",(err, messages) => {
                expect(err).toBeNull();
                expect(messages.length).toEqual(0);
                done();
            });
        });
    });

    it('Get userMessages - not exists user', (done) => {
        Message.getUserMessages("notExist", (err, messages) => {
            expect(err).toBeNull();
            expect(messages.length).toEqual(0);
            done();
        });
    });
    it('Delete exist message', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });
        Message.createMessage(messageToCreate, (err, createdMessage) => {
            expect(err).toBeNull();
            expect(createdMessage.MessageId).toEqual("MessageId");
            expect(createdMessage.From).toEqual("From");
            expect(createdMessage.To).toEqual("To");
            expect(createdMessage.Content).toEqual("Content");
            expect(createdMessage.Date).toEqual(1620139890041);
            expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            expect(createdMessage.FromLastName).toEqual("FromLastName");
            Message.getUserMessages("To",(err, instrucions) => {
                expect(err).toBeNull();
                expect(instrucions.length).toEqual(1);
                Message.removeMessage(messageToCreate.MessageId,(err, messages) => {
                    expect(err).toBeNull();
                    expect(messages.deletedCount).toEqual(1);
                    done();
                });
            });

        });
    });
    it('Delete not exist message', (done) => {
        const messageToCreate = new Message({
            MessageId: "MessageId",
            From: "From",
            To: "To",
            Content: "Content",
            Date: 1620139890041,
            FromFirstName: "FromFirstName",
            FromLastName: "FromLastName"
        });
        Message.createMessage(messageToCreate, (err, createdMessage) => {
            expect(err).toBeNull();
            expect(createdMessage.MessageId).toEqual("MessageId");
            expect(createdMessage.From).toEqual("From");
            expect(createdMessage.To).toEqual("To");
            expect(createdMessage.Content).toEqual("Content");
            expect(createdMessage.Date).toEqual(1620139890041);
            expect(createdMessage.FromFirstName).toEqual("FromFirstName");
            expect(createdMessage.FromLastName).toEqual("FromLastName");
            Message.getUserMessages("To",(err, instrucions) => {
                expect(err).toBeNull();
                expect(instrucions.length).toEqual(1);
                Message.removeMessage("notExists",(err, messages) => {
                    expect(err).toBeNull();
                    expect(messages.deletedCount).toEqual(0);
                    done();
                });
            });

        });
    });
});
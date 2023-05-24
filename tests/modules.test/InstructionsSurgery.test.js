const mongoose = require('mongoose');
const dbHandler = require('../db-handler');
const Instruction = require('../../modules/InstructionsSurgery');
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
describe('InstructionsSurgery tests ', () => {
    it('Create InstructionsSurgery', (done) => {
        const newInstruction = new Instruction({
            InstructionId: "InstructionId",
            Title: "Title",
            PdfName: "PdfName",
            Category: "Category"
        });
        const callback = (err, createdInstruction) => {
            expect(err).toBeNull();
            expect(createdInstruction.InstructionId).toEqual("InstructionId");
            expect(createdInstruction.Title).toEqual("Title");
            expect(createdInstruction.PdfName).toEqual("PdfName");
            expect(createdInstruction.Category).toEqual("Category");
            done();
        };
        Instruction.createInstructionsSurgery(newInstruction, callback);
    });

    it('Get Instructions', (done) => {
        const newInstruction = new Instruction({
            InstructionId: "InstructionId",
            Title: "Title",
            PdfName: "PdfName",
            Category: "Category"
        });

        Instruction.createInstructionsSurgery(newInstruction, (err, creatednewInstruction) => {
            expect(err).toBeNull();
            expect(creatednewInstruction.InstructionId).toEqual("InstructionId");
            expect(creatednewInstruction.Title).toEqual("Title");
            expect(creatednewInstruction.PdfName).toEqual("PdfName");
            expect(creatednewInstruction.Category).toEqual("Category");
            Instruction.getInstructionsSurgery({},(err, instructions) => {
                expect(err).toBeNull();
                expect(instructions.length).toEqual(1);
                expect(instructions[0].InstructionId).toEqual("InstructionId");
                expect(instructions[0].Title).toEqual("Title");
                expect(instructions[0].PdfName).toEqual("PdfName");
                expect(instructions[0].Category).toEqual("Category");
                done();
            });
        });
    });




    it('Get Instructions - empty', (done) => {
        Instruction.getInstructionsSurgery({},(err, instructions) => {
            expect(err).toBeNull();
            expect(instructions.length).toEqual(0);
            done();
        });
    });
    it('Delete exist exercise', (done) => {
        const newInstruction = new Instruction({
            InstructionId: "InstructionId",
            Title: "Title",
            PdfName: "PdfName",
            Category: "Category"
        });

        Instruction.createInstructionsSurgery(newInstruction, (err, creatednewInstruction) => {
            expect(err).toBeNull();
            expect(creatednewInstruction.InstructionId).toEqual("InstructionId");
            expect(creatednewInstruction.Title).toEqual("Title");
            expect(creatednewInstruction.PdfName).toEqual("PdfName");
            expect(creatednewInstruction.Category).toEqual("Category");
            Instruction.getInstructionsSurgery({},(err, instructions) => {
                expect(err).toBeNull();
                expect(instructions.length).toEqual(1);
                expect(instructions[0].InstructionId).toEqual("InstructionId");
                expect(instructions[0].Title).toEqual("Title");
                expect(instructions[0].PdfName).toEqual("PdfName");
                expect(instructions[0].Category).toEqual("Category");
                Instruction.deleteInstruction(newInstruction.InstructionId,(err, instructions) => {
                    expect(err).toBeNull();
                    expect(instructions.deletedCount).toEqual(1);
                    done();
                });
            });
        });
    });
    it('Delete not exist instruction', (done) => {
        Instruction.deleteInstruction("NoId",(err, instructions) => {
            expect(err).toBeNull();
            expect(instructions.deletedCount).toEqual(0);
            done();
        });
    });
});
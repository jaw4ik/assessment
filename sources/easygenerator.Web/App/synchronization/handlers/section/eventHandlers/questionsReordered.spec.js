import handler from './questionsReordered';

import dataContext from 'dataContext';
import constants from 'constants';
import app from 'durandal/app';

describe('synchronization section [questionsReordered]', function () {

    var section = { id: 'sectionId' };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var modifiedOn = new Date(),
        questionId1 = 'id1',
        questionId2 = 'id2',
        questionsOrder = [questionId1, questionId2],
        questions = [{ id: questionId1 }, { id: questionId2 }];

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when sectionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, questionsOrder, modifiedOn.toISOString());
            };

            expect(f).toThrow('SectionId is not a string');
        });
    });

    describe('when questionIds is not an array', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionIds is not an array');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, questionsOrder, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when section is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.sections = [];

            var f = function () {
                handler(section.id, questionsOrder, modifiedOn.toISOString());
            };

            expect(f).toThrow('Section has not been found');
        });
    });

    it('should update section questions order', function () {
        section.questions = questions;
        dataContext.sections = [section];

        handler(section.id, questionsOrder, modifiedOn.toISOString());
        expect(dataContext.sections[0].questions[0].id).toBe(questionId1);
        expect(dataContext.sections[0].questions[1].id).toBe(questionId2);
    });

    it('should update section modified on date', function () {
        section.modifiedOn = "";
        dataContext.sections = [section];
        section.questions = questions;

        handler(section.id, questionsOrder, modifiedOn.toISOString());
        expect(dataContext.sections[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.sections = [section];
        section.questions = questions;

        handler(section.id, questionsOrder, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.questionsReorderedByCollaborator, section);
    });
});

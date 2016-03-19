import handler from './deleted';

import dataContext from 'dataContext';
import constants from 'constants';
import app from 'durandal/app';

describe('synchronization question [deleted]', function () {

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

    it('should delete questions', function () {
        section.modifiedOn = "";
        dataContext.sections = [section];
        section.questions = questions;

        handler(section.id, questionsOrder, modifiedOn.toISOString());
        expect(dataContext.sections[0].questions.length).toBe(0);
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
        expect(app.trigger).toHaveBeenCalled();
        expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.question.deletedByCollaborator);
    });
});

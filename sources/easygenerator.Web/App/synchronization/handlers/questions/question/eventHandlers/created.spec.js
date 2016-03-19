import handler from './created';

import dataContext from 'dataContext';
import constants from 'constants';
import app from 'durandal/app';

describe('synchronization question [created]', function () {

    var section = { id: 'sectionId' };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var question = { Id: '2' },
        modifiedOn = new Date();

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when sectionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, question, modifiedOn.toISOString());
            };

            expect(f).toThrow('SectionId is not a string');
        });
    });

    describe('when question is not object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question is not an object');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, question, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when section is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.sections = [];

            var f = function () {
                handler(section.id, question, modifiedOn.toISOString());
            };

            expect(f).toThrow('Section has not been found');
        });
    });

    describe('when question is already exists in section', function() {
        beforeEach(function() {
            section.questions = [{ id: question.Id }];
            dataContext.sections = [section];
        });

        it('should not add new question to section', function () {
            handler(section.id, question, modifiedOn.toISOString());
            expect(dataContext.sections[0].questions.length).toBe(1);
        });

        it('should not update section modified on date', function () {
            section.modifiedOn = "";
            handler(section.id, question, modifiedOn.toISOString());
            expect(dataContext.sections[0].modifiedOn).toBe('');
        });

        it('should not trigger app event', function () {
            handler(section.id, question, modifiedOn.toISOString());
            expect(app.trigger).not.toHaveBeenCalled();
        });
    });

    describe('when question is not exist in section', function() {
        beforeEach(function() {
            section.questions = [];
            dataContext.sections = [section];
        });

        it('should add new question to section', function () {
            handler(section.id, question, modifiedOn.toISOString());
            expect(dataContext.sections[0].questions.length).toBe(1);
            expect(dataContext.sections[0].questions[0].id).toBe(question.Id);
        });

        it('should update section modified on date', function () {
            dataContext.sections = [section];
            handler(section.id, question, modifiedOn.toISOString());
            expect(dataContext.sections[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            handler(section.id, question, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalled();
            expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.question.createdByCollaborator);
        });
    });
});

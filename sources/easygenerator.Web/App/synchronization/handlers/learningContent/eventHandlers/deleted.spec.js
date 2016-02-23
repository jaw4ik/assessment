import handler from './deleted';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization learningContent [deleted]', function () {

    var question = { id: "questionId" },
        learningContentId = "learningContentId",
        modifiedOn = new Date().toISOString();

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when questionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, learningContentId, modifiedOn);
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when learningContentId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(question.id, undefined, modifiedOn);
            };

            expect(f).toThrow('LearningContentId is not a string');
        });
    });
    describe('when modifiedOn is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(question.id, learningContentId, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when question is not found', function () {
        it('should throw an exception', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([]);
            var f = function () {
                handler(question.id, learningContentId, modifiedOn);
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    describe('when question is found', function () {
        beforeEach(function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        });

        it('should trigger app event \'learningContent:deletedByCollaborator\'', function () {
            handler(question.id, learningContentId, modifiedOn);
            expect(app.trigger).toHaveBeenCalled();
            expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.messages.question.learningContent.deletedByCollaborator);
        });

        it('should set modifiedOn for question', function () {
            question.modifiedOn = '';
            handler(question.id, learningContentId, modifiedOn);
            expect(question.modifiedOn.toISOString()).toBe(modifiedOn);
        });
    });

});

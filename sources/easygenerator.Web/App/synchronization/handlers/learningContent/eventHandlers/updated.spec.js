import handler from './updated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization learningContent [textUpdated]', function () {

    var question = { id: "questionId" },
        learningContent = { Id: "0", Text: "Learning content" },
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
                handler(undefined, learningContent, modifiedOn);
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when learningContent is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(question.id, undefined, modifiedOn);
            };

            expect(f).toThrow('LearningContent is not an object');
        });
    });
    describe('when modifiedOn is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(question.id, learningContent, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when question is not found', function () {
        it('should throw an exception', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([]);
            var f = function () {
                handler(question.id, learningContent, modifiedOn);
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    describe('when question is found', function () {
        beforeEach(function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        });


        it('should trigger app event \'learningContent:updatedByCollaborator\'', function () {
            handler(question.id, learningContent, modifiedOn);
            expect(app.trigger).toHaveBeenCalled();
            expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.messages.question.learningContent.updatedByCollaborator);
        });

        it('should set modifiedOn for question', function () {
            question.modifiedOn = '';
            handler(question.id, learningContent, modifiedOn);
            expect(question.modifiedOn.toISOString()).toBe(modifiedOn);
        });
    });

});

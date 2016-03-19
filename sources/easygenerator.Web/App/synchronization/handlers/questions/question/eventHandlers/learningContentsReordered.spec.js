import handler from './learningContentsReordered';

import dataContext from 'dataContext';
import constants from 'constants';
import app from 'durandal/app';

describe('synchronization question [learningContentsReordered]', function () {

    var section = { id: 'sectionId' },
        question = { id: 'questionId' };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var modifiedOn = new Date(),
        learningContent = 'id1',
        learningContent2 = 'id2',
        learningContentsOrder = [learningContent, learningContent2];

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when questionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, learningContentsOrder, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when learningContents is not an array', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(question.id, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('learningContents is not array');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(question.id, learningContentsOrder, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when question is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.sections = [];

            var f = function () {
                handler(question.id, learningContentsOrder, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question modified on date', function () {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        question.modifiedOn = "";
        section.questions = [question];
        dataContext.sections = [section];
        handler(question.id, learningContentsOrder, modifiedOn.toISOString());
        expect(dataContext.sections[0].questions[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        section.questions = [question];
        dataContext.sections = [section];

        handler(question.id, learningContentsOrder, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.learningContentsReorderedByCollaborator, question, learningContentsOrder);
    });
});

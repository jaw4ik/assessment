import handler from './deleted';

import dataContext from 'dataContext';
import constants from 'constants';
import app from 'durandal/app';

describe('synchronization question [deleted]', function () {

    var objective = { id: 'objectiveId' };

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

    describe('when objectiveId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, questionsOrder, modifiedOn.toISOString());
            };

            expect(f).toThrow('ObjectiveId is not a string');
        });
    });

    describe('when questionIds is not an array', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(objective.id, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionIds is not an array');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(objective.id, questionsOrder, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when objective is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.objectives = [];

            var f = function () {
                handler(objective.id, questionsOrder, modifiedOn.toISOString());
            };

            expect(f).toThrow('Objective has not been found');
        });
    });

    it('should delete questions', function () {
        objective.modifiedOn = "";
        dataContext.objectives = [objective];
        objective.questions = questions;

        handler(objective.id, questionsOrder, modifiedOn.toISOString());
        expect(dataContext.objectives[0].questions.length).toBe(0);
    });

    it('should update objective modified on date', function () {
        objective.modifiedOn = "";
        dataContext.objectives = [objective];
        objective.questions = questions;

        handler(objective.id, questionsOrder, modifiedOn.toISOString());
        expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.objectives = [objective];
        objective.questions = questions;

        handler(objective.id, questionsOrder, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
        expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.question.deletedByCollaborator);
    });
});

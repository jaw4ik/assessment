define(['synchronization/handlers/objectiveEventHandler'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        constants = require('constants'),
        app = require('durandal/app')
    ;

    describe('synchronization [objectiveEventHandler]', function () {

        var objective = { id: 'objectiveId' };

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        describe('objectiveTitleUpdated:', function () {

            var title = "title",
                modifiedOn = new Date();

            it('should be function', function () {
                expect(handler.objectiveTitleUpdated).toBeFunction();
            });

            describe('when objectiveId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectiveTitleUpdated(undefined, title, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('ObjectiveId is not a string');
                });
            });

            describe('when title is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectiveTitleUpdated(objective.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Title is not a string');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectiveTitleUpdated(objective.id, title, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when objective is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.objectives = [];

                    var f = function () {
                        handler.objectiveTitleUpdated(objective.id, title, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Objective has not been found');
                });
            });

            it('should update objective title', function () {
                objective.title = "";
                dataContext.objectives = [objective];
                handler.objectiveTitleUpdated(objective.id, title, modifiedOn.toISOString());

                expect(dataContext.objectives[0].title).toBe(title);
            });

            it('should update objective modified on date', function () {
                objective.modifiedOn = "";
                dataContext.objectives = [objective];
                handler.objectiveTitleUpdated(objective.id, title, modifiedOn.toISOString());

                expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.objectives = [objective];
                handler.objectiveTitleUpdated(objective.id, title, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
            });
        });

        describe('questionsReordered:', function () {

            var modifiedOn = new Date(),
                questionId1 = 'id1',
                questionId2 = 'id2',
                questionsOrder = [questionId1, questionId2],
                questions = [{ id: questionId1 }, { id: questionId2 }];

            it('should be function', function () {
                expect(handler.questionsReordered).toBeFunction();
            });

            describe('when objectiveId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionsReordered(undefined, questionsOrder, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('ObjectiveId is not a string');
                });
            });

            describe('when questionIds is not an array', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionsReordered(objective.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('QuestionIds is not an array');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionsReordered(objective.id, questionsOrder, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when objective is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.objectives = [];

                    var f = function () {
                        handler.questionsReordered(objective.id, questionsOrder, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Objective has not been found');
                });
            });

            it('should update objective questions order', function () {
                objective.questions = questions;
                dataContext.objectives = [objective];

                handler.questionsReordered(objective.id, questionsOrder, modifiedOn.toISOString());
                expect(dataContext.objectives[0].questions[0].id).toBe(questionId1);
                expect(dataContext.objectives[0].questions[1].id).toBe(questionId2);
            });

            it('should update objective modified on date', function () {
                objective.modifiedOn = "";
                dataContext.objectives = [objective];
                objective.questions = questions;

                handler.questionsReordered(objective.id, questionsOrder, modifiedOn.toISOString());
                expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.objectives = [objective];
                objective.questions = questions;

                handler.questionsReordered(objective.id, questionsOrder, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
                expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.objective.questionsReordered);
            });

        });

        describe('questionCreated:', function () {
            var question = { Id: '2' },
                modifiedOn = new Date(),
                questions = [{ id: '0' }, { id: '1' }];

            it('should be function', function () {
                expect(handler.questionCreated).toBeFunction();
            });

            describe('when objectiveId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionCreated(undefined, question, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('ObjectiveId is not a string');
                });
            });

            describe('when question is not object', function() {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionCreated(objective.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Question is not an object');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionCreated(objective.id, question, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when objective is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.objectives = [];

                    var f = function () {
                        handler.questionCreated(objective.id, question, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Objective has not been found');
                });
            });

            it('should add new question to objective', function() {
                objective.questions = questions;
                dataContext.objectives = [objective];

                handler.questionCreated(objective.id, question, modifiedOn.toISOString());
                expect(dataContext.objectives[0].questions.length).toBe(3);
                expect(dataContext.objectives[0].questions[2].id).toBe(question.Id);
            });

            it('should update objective modified on date', function () {
                objective.modifiedOn = "";
                dataContext.objectives = [objective];
                objective.questions = questions;

                handler.questionCreated(objective.id, question, modifiedOn.toISOString());
                expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.objectives = [objective];
                objective.questions = questions;

                handler.questionCreated(objective.id, question, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
                expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.question.createdByCollaborator);
            });
        });

        describe('questionsDeleted:', function () {
            var modifiedOn = new Date(),
               questionId1 = 'id1',
               questionId2 = 'id2',
               questionsOrder = [questionId1, questionId2],
               questions = [{ id: questionId1 }, { id: questionId2 }];

            it('should be function', function () {
                expect(handler.questionsDeleted).toBeFunction();
            });

            describe('when objectiveId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionsDeleted(undefined, questionsOrder, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('ObjectiveId is not a string');
                });
            });

            describe('when questionIds is not an array', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionsDeleted(objective.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('QuestionIds is not an array');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.questionsDeleted(objective.id, questionsOrder, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when objective is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.objectives = [];

                    var f = function () {
                        handler.questionsDeleted(objective.id, questionsOrder, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Objective has not been found');
                });
            });

            it('should delete questions', function() {
                objective.modifiedOn = "";
                dataContext.objectives = [objective];
                objective.questions = questions;

                handler.questionsDeleted(objective.id, questionsOrder, modifiedOn.toISOString());
                expect(dataContext.objectives[0].questions.length).toBe(0);
            });

            it('should update objective modified on date', function () {
                objective.modifiedOn = "";
                dataContext.objectives = [objective];
                objective.questions = questions;

                handler.questionsDeleted(objective.id, questionsOrder, modifiedOn.toISOString());
                expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.objectives = [objective];
                objective.questions = questions;

                handler.questionsDeleted(objective.id, questionsOrder, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
                expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.question.deletedByCollaborator);
            });
        });
    });

})
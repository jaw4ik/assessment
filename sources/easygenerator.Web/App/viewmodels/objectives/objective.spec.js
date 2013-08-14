define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker'),
            dataContext = require('dataContext'),
            objectiveModel = require('models/objective'),
            questionModel = require('models/question'),
            images = require('configuration/images'),
            constants = require('constants');

        var
            createObjectives = function () {
                return [
                        new objectiveModel({
                            id: '0',
                            title: 'Test Objective 0',
                            image: images[0],
                            questions: [
                                new questionModel({
                                    id: '0',
                                    title: 'Question 0',
                                    answerOptions: [],
                                    explanations: []
                                }),
                                new questionModel({
                                    id: '1',
                                    title: 'Question 1',
                                    answerOptions: [],
                                    explanations: []
                                })
                            ]
                        })
                ];
            },
            objectives = null,
            eventsCategory = 'Learning Objective';

        describe('viewModel [objective]', function () {

            beforeEach(function () {
                jasmine.Clock.useMock();

                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('is object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate:', function () {
                var objective2 = new objectiveModel({
                    id: '1',
                    title: 'Test Objective 1',
                    image: images[0],
                    questions: []
                });

                describe('when route data is not defined', function () {
                    it('should navigate to #/400', function () {
                        viewModel.activate(undefined);
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });
                });

                describe('when objective is not defined', function () {
                    it('should navigate to #/400', function () {
                        viewModel.activate({ id: undefined });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });
                });

                describe('when objectiveId not found', function () {
                    it('should navigate to #/404', function () {
                        viewModel.activate({ id: 'Invalid id' });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });
                });

                it('should set current objective title', function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });

                    expect(viewModel.title).toBe(objectives[0].title);
                });

                it('should set current objective image', function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });

                    expect(viewModel.image()).toBe(objectives[0].image);
                });

                it('should initialize questions collection', function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });

                    expect(viewModel.questions().length).toBe(objectives[0].questions.length);
                });

                describe('when currentSortingOption is asc', function () {
                    it('should sort question asc', function () {
                        objectives = createObjectives();
                        dataContext.objectives = objectives;
                        viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);

                        viewModel.activate({ id: objectives[0].id });

                        expect(viewModel.questions).toBeSortedAsc('title');
                    });
                });

                describe('when currentSortingOption is desc', function () {
                    it('should sort question desc', function () {
                        objectives = createObjectives();
                        dataContext.objectives = objectives;
                        viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);

                        viewModel.activate({ id: objectives[0].id });

                        expect(viewModel.questions).toBeSortedDesc('title');
                    });
                });

                describe('when previous objective exists', function () {
                    it('should set previousObjectiveId', function () {
                        objectives = createObjectives();
                        objectives.push(objective2);
                        dataContext.objectives = objectives;

                        viewModel.activate({ id: objectives[1].id });

                        expect(viewModel.previousObjectiveId).toBe(objectives[0].id);
                    });
                });

                describe('when previous objective does not exist', function () {
                    it('should set previousObjectiveId to null', function () {
                        objectives = createObjectives();
                        dataContext.objectives = objectives;

                        viewModel.activate({ id: objectives[0].id });

                        expect(viewModel.previousObjectiveId).toBeNull();
                    });
                });

                describe('when next objective exists', function () {
                    it('should set nextObjectiveId', function () {
                        objectives = createObjectives();
                        objectives.push(objective2);
                        dataContext.objectives = objectives;

                        viewModel.activate({ id: objectives[0].id });

                        expect(viewModel.nextObjectiveId).toBe(objectives[1].id);
                    });
                });

                describe('when next objective does not exist', function () {
                    it('should set nextObjectiveId to null', function () {
                        objectives = createObjectives();
                        dataContext.objectives = objectives;

                        viewModel.activate({ id: objectives[0].id });

                        expect(viewModel.nextObjectiveId).toBeNull();
                    });
                });
            });

            describe('navigateToObjectives', function () {

                it('should navigate to #/objectives', function () {
                    viewModel.navigateToObjectives();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objectives');
                });

                it('should send event \"Navigate to Learning Objectives\"', function () {
                    viewModel.navigateToObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Learning Objectives', eventsCategory);
                });

            });

            describe('navigateToEditQuestion', function () {
                beforeEach(function () {
                    objectives = createObjectives();
                });

                describe('when question is null', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(null); };
                        expect(f).toThrow();
                    });
                });

                describe('when question is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(); };
                        expect(f).toThrow();
                    });
                });

                describe('when question does not have property id', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({}); };
                        expect(f).toThrow();
                    });
                });

                describe('when question id is null', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({ id: null }); };
                        expect(f).toThrow();
                    });
                });

                it('should navigate to #/objectives', function () {
                    viewModel.objectiveId = objectives[0].id;

                    viewModel.navigateToEditQuestion(objectives[0].questions[0]);

                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objectives[0].id + '/question/' + objectives[0].questions[0].id);
                });

                it('should send event \"Navigate to edit question\"', function () {
                    viewModel.objectiveId = objectives[0].id;

                    viewModel.navigateToEditQuestion(objectives[0].questions[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to edit question', eventsCategory);
                });

            });

            describe('navigateToNextObjective:', function () {
                var nextObjectiveId = 1;

                it('should be a function', function () {
                    expect(viewModel.navigateToNextObjective).toBeFunction();
                });

                it('should send event \'Navigate to next objective\'', function () {
                    viewModel.navigateToNextObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next objective', eventsCategory);
                });

                describe('when nextObjectiveId is undefined', function () {

                    it('should navigate to #/404', function () {
                        viewModel.nextObjectiveId = undefined;
                        viewModel.navigateToNextObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });

                describe('when nextObjectiveId is null', function () {

                    it('should navigate to #/404', function () {
                        viewModel.nextObjectiveId = null;
                        viewModel.navigateToNextObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });

                describe('when nextObjectiveId is not null or undefined', function () {
                    it('should navigate to #/objective/{nextObjectiveId}', function () {
                        viewModel.nextObjectiveId = nextObjectiveId;
                        viewModel.navigateToNextObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + nextObjectiveId);
                    });
                });
            });

            describe('navigateToCreateQuestion:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreateQuestion).toBeFunction();
                });

                it('should send event \'Navigate to create question\'', function () {
                    viewModel.navigateToCreateQuestion();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create question', eventsCategory);
                });

                it('should navigate to #/objective/{objectiveId}/question/create', function () {
                    viewModel.objectiveId = '0';

                    viewModel.navigateToCreateQuestion();

                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + viewModel.objectiveId + '/question/create');
                });
            });

            describe('navigateToPreviousObjective:', function () {
                var previousObjectiveId = 0;

                it('should be a function', function () {
                    expect(viewModel.navigateToPreviousObjective).toBeFunction();
                });

                it('should send event \'Navigate to previous objective\'', function () {
                    viewModel.navigateToPreviousObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous objective', eventsCategory);
                });

                describe('when previousObjectiveId is null', function () {
                    it('should navigate to #/404', function () {
                        viewModel.previousObjectiveId = null;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });
                });

                describe('when previousObjectiveId is undefined', function () {
                    it('should navigate to #/404', function () {
                        viewModel.previousExperienceId = undefined;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });
                });

                describe('when previousObjectiveId is not null', function () {

                    it('should navigate to #/experience/{previousObjectiveId}', function () {
                        viewModel.previousObjectiveId = previousObjectiveId;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + previousObjectiveId);
                    });
                });
            });

            describe('sortByTitleAsc', function () {

                beforeEach(function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });
                });

                it('should send event \"Sort questions by title ascending\"', function () {
                    viewModel.sortByTitleAsc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title ascending', eventsCategory);
                });

                it('should change sorting option to constants.sortingOptions.byTitleAcs', function () {
                    viewModel.sortByTitleAsc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleAsc);
                });

                it('should sort questions', function () {
                    viewModel.sortByTitleAsc();
                    expect(viewModel.questions()).toBeSortedAsc('title');
                });
            });

            describe('sortByTitleDesc', function () {

                beforeEach(function () {
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });
                });

                it('should send event \"Sort questions by title descending\"', function () {
                    viewModel.sortByTitleDesc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title descending', eventsCategory);
                });

                it('should change sorting option to constants.sortingOptions.byTitleDecs', function () {
                    viewModel.sortByTitleDesc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleDesc);
                });

                it('should sort questions', function () {
                    viewModel.sortByTitleDesc();

                    expect(viewModel.questions()).toBeSortedDesc('title');
                });
            });

            describe('deleteSelectedQuestions', function () {
                var question;
                beforeEach(function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });
                    question = viewModel.questions()[0];
                });

                it('should be a function', function () {
                    expect(viewModel.deleteSelectedQuestions).toBeFunction();
                });

                it('should send event \'Delete question\'', function () {
                    viewModel.questions()[0].isSelected(true);

                    viewModel.deleteSelectedQuestions();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete question', eventsCategory);
                });

                it('should delete selected question', function () {
                    var questionToDeleteId = question.id;
                    question.isSelected(true);

                    viewModel.deleteSelectedQuestions();

                    expect(_.find(viewModel.questions(), function (item) {
                        return item.id == questionToDeleteId;
                    })).toBeUndefined();
                });
            });

            describe('canDeleteQuestions:', function () {

                beforeEach(function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });
                });

                it('should be observable', function () {
                    expect(viewModel.canDeleteQuestions).toBeObservable();
                });

                describe('when viewModel just created', function () {
                    it('should be false', function () {
                        expect(viewModel.canDeleteQuestions()).toBe(false);
                    });
                });

                describe('when question is selected', function () {
                    it('should be true', function () {
                        viewModel.questions()[0].isSelected(true);
                        expect(viewModel.canDeleteQuestions()).toBe(true);
                    });
                });

                describe('when few questions are selected', function () {
                    it('should befalse', function () {
                        viewModel.questions()[0].isSelected(true);
                        viewModel.questions()[1].isSelected(true);
                        expect(viewModel.canDeleteQuestions()).toBe(false);
                    });
                });
            });

            describe('toggleQuestionSelection', function () {

                var question;
                beforeEach(function () {
                    objectives = createObjectives();
                    objectives.questions = [objectives[0].questions[0]];
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });

                    question = viewModel.questions()[0];
                });

                it('should be a function', function () {
                    expect(viewModel.toggleQuestionSelection).toBeFunction();
                });

                describe('when question is null', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(null); };
                        expect(f).toThrow();
                    });
                });

                describe('when question is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(); };
                        expect(f).toThrow();
                    });
                });

                describe('when question does not have isSelected() observable', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection({}); };
                        expect(f).toThrow();
                    });
                });

                describe('when question is not selected', function () {
                    it('should send event \'Select question\'', function () {
                        question.isSelected(false);

                        viewModel.toggleQuestionSelection(question);

                        expect(eventTracker.publish).toHaveBeenCalledWith('Select question', eventsCategory);
                    });

                    it('should set question.isSelected to true', function () {
                        question.isSelected(false);

                        viewModel.toggleQuestionSelection(question);

                        expect(question.isSelected()).toBeTruthy();
                    });
                });

                describe('when question is selected', function () {
                    it('should send event \'Unselect question\'', function () {
                        question.isSelected(true);

                        viewModel.toggleQuestionSelection(question);

                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect question', eventsCategory);
                    });

                    it('should set question.isSelected to false', function () {
                        question.isSelected(true);

                        viewModel.toggleQuestionSelection(question);

                        expect(question.isSelected()).toBeFalsy();
                    });
                });
            });

            describe('questions', function () {
                it('should be observable', function () {
                    expect(viewModel.questions).toBeObservable();
                });
            });
        });
    }
);
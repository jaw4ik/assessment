define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var
            router = require('durandal/plugins/router'),
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
            });

            it('is object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate', function () {

                beforeEach(function () {
                    spyOn(router, 'replaceLocation');
                });

                describe('should navigate to #/400', function () {

                    it('when route data is not defined', function () {
                        viewModel.activate(undefined);
                        expect(router.replaceLocation).toHaveBeenCalledWith('#/400');
                    });

                    it('when objective is not defined', function () {
                        viewModel.activate({ id: undefined });
                        expect(router.replaceLocation).toHaveBeenCalledWith('#/400');
                    });

                });

                it('should navigate to #/404 when objective not found', function () {
                    viewModel.activate({ id: 'Invalid id' });
                    expect(router.replaceLocation).toHaveBeenCalledWith('#/404');
                });

                it('should initialize fileds with objective values', function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });

                    expect(viewModel.canDeleteQuestions()).toBe(false);
                    expect(viewModel.title()).toBe(objectives[0].title);
                    expect(viewModel.image()).toBe(objectives[0].image);
                    expect(viewModel.questions().length).toBe(objectives[0].questions.length);
                });
            });

            describe('deactivate', function() {
                beforeEach(function() {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });
                });

                it('should remove all subscribtions from question', function () {
                    viewModel.questions()[0].isEditing(true);
                    viewModel.questions()[0].isEditing(false);
                    viewModel.questions()[1].isEditing(true);

                    viewModel.deactivate();

                    expect(viewModel.questions()[0].isEditing.getSubscriptionsCount()).toBe(0);
                    expect(viewModel.questions()[1].isEditing.getSubscriptionsCount()).toBe(0);
                });
            });

            describe('navigateToObjectives', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should navigate to #/objectives', function () {
                    viewModel.navigateToObjectives();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objectives');
                });

                it('should send event \"Navigate to Learning Objectives\"', function () {
                    viewModel.navigateToObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Learning Objectives', eventsCategory);
                });

            });

            describe('navigateToEdit', function () {
                beforeEach(function () {
                    objectives = createObjectives();
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should navigate to #/objectives', function () {
                    viewModel.objectiveId = objectives[0].id;
                    viewModel.navigateToEdit(objectives[0].questions[0]);
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objectives[0].id + '/question/' + objectives[0].questions[0].id);
                });

                it('should send event \"Navigate to edit question\"', function () {
                    viewModel.objectiveId = objectives[0].id;
                    viewModel.navigateToEdit(objectives[0].questions[0]);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to edit question', eventsCategory);
                });

            });

            describe('sortByTitleAsc', function () {

                beforeEach(function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });
                });

                it('should send event \"Sort questions by title ascending\"', function () {
                    spyOn(eventTracker, 'publish');
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
                    spyOn(eventTracker, 'publish');
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

            describe('addQuestion', function () {
                beforeEach(function () {
                    viewModel.questions([]);
                });

                it('should be a function', function () {
                    expect(viewModel.addQuestion).toBeFunction();
                });

                it('should send event \'Add question\'', function () {
                    spyOn(eventTracker, 'publish');

                    viewModel.addQuestion();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Add question', eventsCategory);
                });

                it('should add question to viewModel', function () {
                    viewModel.addQuestion();

                    expect(viewModel.questions().length).toBe(1);
                    expect(viewModel.questions()[0].id).toBeDefined();
                    expect(viewModel.questions()[0].title).toBeDefined();
                });

                it('should add question with empty title', function () {
                    viewModel.addQuestion();

                    expect(viewModel.questions()[0].title()).toBe('');
                });

                it('should set to added question isEditing to true', function () {
                    viewModel.addQuestion();

                    expect(viewModel.questions()[0].isEditing()).toBe(true);
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
                    spyOn(eventTracker, 'publish');
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

                it('should remove subscribtions from deleted question', function() {
                    question.isEditing(true);
                    question.isSelected(true);
                
                    viewModel.deleteSelectedQuestions();

                    expect(question.isEditing.getSubscriptionsCount()).toBe(0);
                });
            });

            describe('canDeleteQuestions()', function () {

                beforeEach(function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });
                });

                it('should be observable', function () {
                    expect(viewModel.canDeleteQuestions).toBeObservable();
                });

                it('should be \'false\' initially', function () {
                    expect(viewModel.canDeleteQuestions()).toBe(false);
                });

                it('should be \'true\' if question is selected', function () {
                    viewModel.questions()[0].isSelected(true);

                    expect(viewModel.canDeleteQuestions()).toBe(true);
                });

                it('should be \'false\' is few questions selected', function () {
                    viewModel.questions()[0].isSelected(true);
                    viewModel.questions()[1].isSelected(true);

                    expect(viewModel.canDeleteQuestions()).toBe(false);
                });
            });

            describe('endEditQuestionTitle', function () {

                var question;
                beforeEach(function () {
                    objectives = createObjectives();
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });

                    question = viewModel.questions()[0];
                });

                it('should be a function', function () {
                    expect(viewModel.endEditQuestionTitle).toBeFunction();
                });

                it('should send event \'Edit question title\'', function () {
                    question.title('newtitle');
                    spyOn(eventTracker, 'publish');

                    viewModel.endEditQuestionTitle(question);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Edit question title', eventsCategory);
                });

                it('should set \'isEditable\' to \'false\'', function () {
                    question.isEditing(true);

                    viewModel.endEditQuestionTitle(question);

                    expect(question.isEditing()).toBe(false);
                });

                it('should set \'isModified\' to \'true\' if value is empty', function () {
                    question.title('');
                    question.title.isModified(false);

                    viewModel.endEditQuestionTitle(question);

                    expect(question.title.isModified()).toBe(true);
                });

                it('should set \'isModified\' to \'true\' if value is too long', function () {
                    var title = '';
                    for (var i = 0; i < 256; i++)
                        title += '*';

                    question.title(title);
                    question.title.isModified(false);

                    viewModel.endEditQuestionTitle(question);

                    expect(question.title.isModified()).toBe(true);
                });

            });

            describe('questions', function () {
                var question;
                beforeEach(function () {
                    objectives = createObjectives();
                    objectives.questions = [objectives[0].questions[0]];
                    dataContext.objectives = objectives;

                    viewModel.activate({ id: objectives[0].id });

                    question = viewModel.questions()[0];
                });

                it('should be observable', function () {
                    expect(viewModel.questions).toBeObservable();
                });

                describe('isEditing', function () {
                    
                    beforeEach(function () {
                        objectives = createObjectives();
                        objectives[0].questions = [objectives[0].questions[0]];
                        dataContext.objectives = objectives;

                        viewModel.activate({ id: objectives[0].id });

                        question = viewModel.questions()[0];
                    });

                    it('should be observable', function () {
                        expect(question.isEditing).toBeObservable();
                    });

                    it('should save question title on timer when \'true\'', function () {
                        question.isEditing(false);
                        var newText = "New text lalala";
                        question.title(newText);

                        question.isEditing(true);
                        jasmine.Clock.tick(60000);

                        expect(dataContext.objectives[0].questions[0].title).toBe(newText);
                    });
                });

                describe('title', function () {

                    it('should be observable', function () {
                        expect(question.title).toBeObservable();
                    });

                    it('should have \'isModified\' observable', function () {
                        expect(question.title.isModified).toBeObservable();
                    });

                    describe('isValid()', function () {

                        it('should be observable', function () {
                            expect(question.title.isValid).toBeObservable();
                        });

                        it('should be \'false\' is title is empty', function () {
                            question.title('');

                            expect(question.title.isValid()).toBe(false);
                        });

                        it('should be \'false\' is title is longer than 255', function () {
                            var title = '';
                            for (var i = 0; i < 256; i++)
                                title += '*';

                            question.title(title);

                            expect(question.title.isValid()).toBe(false);
                        });

                    });
                });

                describe('toggleSelection', function () {

                    it('should be a function', function () {
                        expect(question.toggleSelection).toBeFunction();
                    });

                    it('should send event \'Select question\'', function () {
                        spyOn(eventTracker, 'publish');
                        question.isSelected(false);

                        question.toggleSelection(question);

                        expect(eventTracker.publish).toHaveBeenCalledWith('Select question', eventsCategory);
                    });

                    it('should send event \'Unelect question\'', function () {
                        spyOn(eventTracker, 'publish');
                        question.isSelected(true);

                        question.toggleSelection(question);

                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect question', eventsCategory);
                    });
                });
            });
        });
    }
);
define(function (require) {
    "use strict";

    var
        viewModel = require('viewModels/questions/question'),
        router = require('durandal/plugins/router'),
        dataContext = require('dataContext'),
        objectiveModel = require('models/objective'),
        questionModel = require('models/question'),
        explanationModel = require('models/explanation'),
        answerOptionModel = require('models/answerOption'),
        images = require('configuration/images'),
        eventTracker = require('eventTracker');

    var eventsCategory = 'Question';

    describe('viewModel [question]', function () {

        it('is defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate', function () {

            describe('should navigate to #/400 when', function () {

                beforeEach(function () {
                    spyOn(router, 'navigateTo');
                });

                it('route data is empty', function () {
                    //act
                    viewModel.activate();

                    //assert
                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });

                it('objectiveId is undefined', function () {
                    //act
                    viewModel.activate({ id: '0', objectiveId: undefined });

                    //assert
                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });

                it('question id is undefined', function () {
                    //act
                    viewModel.activate({ objectiveId: '123', id: undefined });

                    //assert
                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });
            });

            describe('should navigate to #/404 when', function () {

                beforeEach(function () {
                    spyOn(router, 'navigateTo');
                });

                it('objective not found', function () {
                    // arrange
                    dataContext.objectives = [];

                    //act
                    viewModel.activate({ id: '0', objectiveId: '0' });

                    //assert
                    expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                });

                it('question not found', function () {
                    //arrange
                    dataContext.objectives = [
                        new objectiveModel({
                            id: 'obj1',
                            title: 'Test Objective',
                            image: images[0],
                            questions: []
                        })];

                    //act
                    viewModel.activate({ id: 'someId', objectiveId: 'obj1' });

                    //assert
                    expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                });

            });

            it('should disable next when question is last', function () {
                //arrange
                dataContext.objectives = [
                       new objectiveModel(
                        {
                            id: 'obj2',
                            title: 'Test Objective',
                            image: images[0],
                            questions:
                                [
                                    new questionModel({
                                        id: 0,
                                        title: 'Question 1',
                                        answerOptions: [],
                                        explanations: []
                                    })
                                ]
                        })];

                //act
                viewModel.activate({ objectiveId: 'obj2', id: '0' });

                //assert
                expect(viewModel.hasNext).toBe(false);
            });

            it('should disable previous when question is first', function () {
                //arrange
                dataContext.objectives = [
                       new objectiveModel(
                        {
                            id: 'obj3',
                            title: 'Test Objective',
                            image: images[0],
                            questions:
                                [
                                    new questionModel({
                                        id: 0,
                                        title: 'Question 1',
                                        answerOptions: [],
                                        explanations: []
                                    })
                                ]
                        })];

                //act
                viewModel.activate({ objectiveId: 'obj3', id: '0' });

                //assert
                expect(viewModel.hasPrevious).toBe(false);
            });

            it('should initialize fields', function () {
                //arrange
                var question = new questionModel({
                    id: '1',
                    title: 'Question 2',
                    answerOptions: [],
                    explanations: []
                });

                var objective = new objectiveModel(
                    {
                        id: 'TestId7',
                        title: 'Test Objective 7',
                        image: images[0],
                        questions:
                        [
                            new questionModel({
                                id: '0',
                                title: 'Question 1',
                                answerOptions: [],
                                explanations: []
                            }),
                            question,
                            new questionModel({
                                id: '2',
                                title: 'Question 3',
                                answerOptions: [],
                                explanations: []
                            })
                        ]
                    });

                dataContext.objectives = [objective];

                //act
                viewModel.activate({ id: question.id, objectiveId: objective.id });

                //assert
                expect(viewModel.objectiveTitle).toBe(objective.title);
                expect(viewModel.objectiveId).toBe(objective.id);
                expect(viewModel.title).toBe(question.title);
                expect(viewModel.question).toBeDefined();

                expect(viewModel.answerOptions().lenght).toBe(question.answerOptions.lenght);
                expect(viewModel.explanations().lenght).toBe(question.explanations.lenght);
                expect(viewModel.hasPrevious).toBe(true);
                expect(viewModel.hasNext).toBe(true);
            });
        });

        describe('goToRelatedObjective', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('should track event \"Navigate to related objective\"', function () {
                //act
                viewModel.goToRelatedObjective();

                //assert
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to related objective', eventsCategory);
            });

            it('should navigate to objective', function () {

                //arrange
                viewModel.objectiveId = '0';

                //act
                viewModel.goToRelatedObjective();

                //assert
                expect(router.navigateTo).toHaveBeenCalledWith('#/objective/0');
            });

        });

        describe('goToPreviousQuestion', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('should track event \"Navigate to previous question\"', function () {
                //arrange
                viewModel.objectiveId = '1';
                viewModel.hasPrevious = true;
                viewModel.previousId = 0;

                //act
                viewModel.goToPreviousQuestion();

                //assert
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous question', eventsCategory);
            });

            it('should navigate to previous question', function () {
                //arrange
                viewModel.objectiveId = '1';
                viewModel.hasPrevious = true;
                viewModel.previousId = 0;

                //act
                viewModel.goToPreviousQuestion();

                //assert
                expect(router.navigateTo).toHaveBeenCalledWith('#/objective/1/question/0');
            });

            it('should navigate to #/404 if previous question doesnt exist', function () {
                //arrange
                viewModel.hasPrevious = false;

                // act
                viewModel.goToPreviousQuestion();

                // asert
                expect(router.navigateTo).toHaveBeenCalledWith('#/404');
            });
        });

        describe('goToNextQuestion', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('should track event \'Navigate to next question\'', function () {
                //arrange
                viewModel.objectiveId = '1';
                viewModel.hasNext = true;
                viewModel.nextId = '1';

                //act
                viewModel.goToNextQuestion();

                //assert
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next question', eventsCategory);
            });

            it('should navigate to next question', function () {
                //arrange
                viewModel.objectiveId = '1';
                viewModel.hasNext = true;
                viewModel.nextId = '1';

                //act
                viewModel.goToNextQuestion();

                //assert
                expect(router.navigateTo).toHaveBeenCalledWith('#/objective/1/question/1');
            });

            it('should throw if next question doesnt exist', function () {
                //arrange
                viewModel.hasNext = false;

                // act
                viewModel.goToNextQuestion();

                // assert
                expect(router.navigateTo).toHaveBeenCalledWith('#/404');
            });
        });

        describe('toggle', function () {

            describe('answers', function () {

                it('should toggle false value', function () {
                    //arrange
                    viewModel.isAnswersBlockExpanded(false);

                    //act
                    viewModel.toggleAnswers();

                    //assert
                    expect(viewModel.isAnswersBlockExpanded()).toBe(true);
                });

                it('should toggle true value', function () {
                    //arrange
                    viewModel.isAnswersBlockExpanded(true);

                    //act
                    viewModel.toggleAnswers();

                    //assert
                    expect(viewModel.isAnswersBlockExpanded()).toBe(false);
                });
            });

            describe('explanations', function () {

                it('should toggle false value', function () {
                    //arrange
                    viewModel.isExplanationsBlockExpanded(false);

                    //act
                    viewModel.toggleExplanations();

                    //assert
                    expect(viewModel.isExplanationsBlockExpanded()).toBe(true);
                });

                it('should toggle true value', function () {
                    //arrange
                    viewModel.isExplanationsBlockExpanded(true);

                    //act
                    viewModel.toggleExplanations();

                    //assert
                    expect(viewModel.isExplanationsBlockExpanded()).toBe(false);
                });
            });
        });

        describe('explanations', function () {

            beforeEach(function () {
                dataContext.objectives = [
                            new objectiveModel(
                                {
                                    id: 'obj3',
                                    title: 'Test Objective',
                                    image: images[0],
                                    questions:
                                        [
                                            new questionModel({
                                                id: '0',
                                                title: 'Question 1',
                                                answerOptions: [],
                                                explanations: ['explanation 1', 'explanation 2', 'explanation 3']
                                            })
                                        ]
                                })];
                viewModel.activate({ id: '0', objectiveId: 'obj3' });
            });

            it('should have isEdititng observable', function () {
                expect(ko.isObservable(viewModel.explanations()[0].isEditing)).toBeTruthy();
            });

            it('should have text observable', function () {
                expect(ko.isObservable(viewModel.explanations()[0].text)).toBeTruthy();
            });
        });

        describe('editExplanation', function () {

            beforeEach(function () {
                dataContext.objectives = [
                            new objectiveModel(
                                {
                                    id: 'obj3',
                                    title: 'Test Objective',
                                    image: images[0],
                                    questions:
                                        [
                                            new questionModel({
                                                id: '0',
                                                title: 'Question 1',
                                                answerOptions: [],
                                                explanations: ['explanation 1', 'explanation 2', 'explanation 3']
                                            })
                                        ]
                                })];
                viewModel.activate({ id: '0', objectiveId: 'obj3' });
            });

            it('should be a function', function () {
                expect(viewModel.editExplanation).toEqual(jasmine.any(Function));
            });

            it('should change isEditing flag to true', function () {
                viewModel.explanations()[0].isEditing(false);
                viewModel.editExplanation(viewModel.explanations()[0]);
                expect(viewModel.explanations()[0].isEditing()).toBe(true);
            });
        });

        describe('endEditExplanation', function () {

            var explanation = {
                text: ko.observable('Some text'),
                isEditing: ko.observable(false),
                id: '0'
            };

            beforeEach(function () {
                viewModel.explanations = ko.observableArray([explanation]);
            });

            it('should be a function', function () {
                expect(viewModel.endEditExplanation).toEqual(jasmine.any(Function));
            });

            it('should set isEditing to false', function () {
                viewModel.explanations()[0].isEditing(true);
                viewModel.endEditExplanation(viewModel.explanations()[0]);
                expect(viewModel.explanations()[0].isEditing()).toBe(false);
            });

            it('shuld remove entry whith empty text', function () {
                //arrange
                viewModel.explanations()[0].isEditing(true);
                viewModel.explanations()[0].text('');

                //act
                viewModel.endEditExplanation(viewModel.explanations()[0]);

                //aasert
                expect(_.find(viewModel.explanations(), function (item) {
                    return item.id == explanation.id;
                })).toBeUndefined();
            });
        });

        describe('addExplanation', function () {

            beforeEach(function () {
                viewModel.explanations = ko.observableArray([]);
            });

            it('should be a function', function () {
                //act & assert
                expect(viewModel.addExplanation).toEqual(jasmine.any(Function));
            });

            it('should send event \'Add explanation\'', function () {
                //arrange
                spyOn(eventTracker, 'publish');

                //act
                viewModel.addExplanation();

                //assert
                expect(eventTracker.publish).toHaveBeenCalledWith('Add explanation', eventsCategory);
            });

            it('should add explanation to viewModel', function () {
                //act
                viewModel.addExplanation();
                //assert
                expect(viewModel.explanations().length).toBe(1);
                expect(viewModel.explanations()[0].text).toBeDefined();
                expect(viewModel.explanations()[0].id).toBeDefined();
                expect(ko.isObservable(viewModel.explanations()[0].isEditing)).toBe(true);
            });

            it('should set isEditing observable to true for new explanation', function () {
                //act
                viewModel.addExplanation();

                //assert
                expect(viewModel.explanations()[0].isEditing()).toBe(true);
            });
        });

        describe('deleteExplanation', function () {

            var explanation = {
                text: ko.observable('Some text'),
                isEditing: ko.observable(false),
                id: '0'
            };

            beforeEach(function () {
                viewModel.explanations = ko.observableArray([explanation]);
            });

            it('should be a function', function () {
                //act & assert
                expect(viewModel.deleteExplanation).toEqual(jasmine.any(Function));
            });

            it('should send event \'Delete explanation\'', function () {
                //arrange
                spyOn(eventTracker, 'publish');

                //act
                viewModel.deleteExplanation(explanation);

                //assert
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete explanation', eventsCategory);
            });

            it('should delete explanation form viewModel', function () {
                //act
                viewModel.deleteExplanation(explanation);

                //assert
                expect(viewModel.explanations().length).toBe(0);
            });
        });

        describe('language', function () {

            it('should be observable', function () {
                expect(ko.isObservable(viewModel.language)).toBe(true);
            });

        });

        describe('answer options', function () {

            var answer = new answerOptionModel({
                id: 0,
                text: 'option 1',
                isCorrect: false
            });

            var question = new questionModel({
                answerOptions: [
                    answer,
                    new answerOptionModel({
                        id: 1,
                        text: 'option 2',
                        isCorrect: true
                    }),
                    new answerOptionModel({
                        id: 2,
                        text: 'option 3',
                        isCorrect: false
                    })
                ]
            });

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
            });

            describe('add', function () {

                it('[addAnswerOption] should be a function', function () {
                    expect(viewModel.addAnswerOption).toEqual(jasmine.any(Function));
                });

                it('[answerOptions] should be observable', function () {
                    expect(ko.isObservable(viewModel.answerOptions)).toBeTruthy();
                });

                it('should track event \"Add answer option\"', function () {
                    viewModel.question({ answerOptions: [] });
                    viewModel.addAnswerOption();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Add answer option', eventsCategory);
                });

                it('function [addAnswerOption] should create option', function () {
                    viewModel.question({ answerOptions: [] });
                    viewModel.answerOptions([]);

                    viewModel.addAnswerOption();

                    expect(viewModel.answerOptions().length).toBe(1);
                });
            });

            describe('edit', function () {

                beforeEach(function () {
                    viewModel.question({ answerOptions: [answer] });
                    viewModel.answerOptions([{
                        id: answer.id,
                        text: ko.observable(answer.text),
                        isCorrect: ko.observable(answer.isCorrect)
                    }]);
                });

                it('the field [isCorrect] should be observable', function () {
                    expect(ko.isObservable(viewModel.answerOptions()[0].isCorrect)).toBeTruthy();
                });

                it('should track event \"Change answer option correctness\"', function () {
                    viewModel.toggleAnswerCorrectness(viewModel.answerOptions()[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness', eventsCategory);
                });

                it('should change option correctness', function () {
                    viewModel.answerOptions()[0].isCorrect(false);
                    viewModel.question().answerOptions[0].isCorrect = false;

                    viewModel.toggleAnswerCorrectness(viewModel.answerOptions()[0]);

                    expect(viewModel.answerOptions()[0].isCorrect()).toBeTruthy();
                });

                it('should track event \"Save the answer option text\"', function () {
                    var context = {
                        target: { innerText: '', innerHTML: '' }
                    };
                    viewModel.saveAnswerOption(viewModel.answerOptions()[0], context);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Save the answer option text', eventsCategory);
                });

                it('should edit answer text', function () {
                    viewModel.answerOptions()[0].text = answer.text;

                    var newText = 'new text';
                    var context = {
                        target: { innerText: newText, innerHTML: newText }
                    };

                    viewModel.saveAnswerOption(viewModel.answerOptions()[0], context);

                    expect(viewModel.answerOptions()[0].text).toBe(newText);
                });

                it('should delete answer option when text is empty', function () {
                    var answersCount = viewModel.answerOptions().length;

                    var context = {
                        target: { innerText: '', innerHTML: '' }
                    };
                    viewModel.saveAnswerOption(viewModel.answerOptions()[0], context);

                    expect(viewModel.answerOptions().length).toBe(answersCount - 1);
                });

                it('should delete answer option when text contains only white-spaces and new lines codes', function () {
                    var answersCount = viewModel.answerOptions().length;

                    var context = {
                        target: { innerText: '   \n\r  \n\r', innerHTML: '<p>&nbsp</p><p>&nbsp</p>' }
                    };
                    viewModel.saveAnswerOption(viewModel.answerOptions()[0], context);

                    expect(viewModel.answerOptions().length).toBe(answersCount - 1);
                });
            });

            describe('delete', function () {

                beforeEach(function () {
                    viewModel.question({ answerOptions: [answer] });
                    viewModel.answerOptions([{
                        id: answer.id,
                        text: ko.observable(answer.text),
                        isCorrect: ko.observable(answer.isCorrect)
                    }]);
                });

                it('should track event \"Delete answer option\"', function () {
                    viewModel.deleteAnswerOption(viewModel.answerOptions()[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option', eventsCategory);
                });

                it('[deleteAnswerOption] should be function', function () {
                    expect(viewModel.deleteAnswerOption).toEqual(jasmine.any(Function));
                });

                it('should delete item', function () {
                    var currentCount = viewModel.question().answerOptions.length;
                    viewModel.deleteAnswerOption(viewModel.answerOptions()[0]);

                    expect(viewModel.answerOptions().length).toBe(currentCount - 1);
                });
            });
        });
    });
});
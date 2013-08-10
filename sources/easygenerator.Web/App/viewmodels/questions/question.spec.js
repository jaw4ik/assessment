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
                    viewModel.activate();

                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });

                it('objectiveId is undefined', function () {
                    viewModel.activate({ id: '0', objectiveId: undefined });

                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });

                it('question id is undefined', function () {
                    viewModel.activate({ objectiveId: '123', id: undefined });

                    expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                });
            });

            describe('should navigate to #/404 when', function () {

                beforeEach(function () {
                    spyOn(router, 'navigateTo');
                });

                it('objective not found', function () {
                    dataContext.objectives = [];

                    viewModel.activate({ id: '0', objectiveId: '0' });

                    expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                });

                it('question not found', function () {
                    dataContext.objectives = [
                        new objectiveModel({
                            id: 'obj1',
                            title: 'Test Objective',
                            image: images[0],
                            questions: []
                        })];

                    //act
                    viewModel.activate({ id: 'someId', objectiveId: 'obj1' });

                    expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                });

            });

            it('should disable next when question is last', function () {
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

                viewModel.activate({ objectiveId: 'obj2', id: '0' });

                expect(viewModel.hasNext).toBe(false);
            });

            it('should disable previous when question is first', function () {
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

                viewModel.activate({ objectiveId: 'obj3', id: '0' });

                expect(viewModel.hasPrevious).toBe(false);
            });

            it('should initialize fields', function () {
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

        describe('deactivate', function () {

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
                                                 explanations: [
                                                     new explanationModel({
                                                         id: '0',
                                                         text: 'Default text1'
                                                     }),
                                                      new explanationModel({
                                                          id: '1',
                                                          text: 'Default text2'
                                                      })
                                                 ]
                                             })
                                         ]
                                 })];
                viewModel.activate({ id: '0', objectiveId: 'obj3' });
            });

            it('should be a function', function () {
                expect(viewModel.deactivate).toBeDefined();
            });

            it('should set explanation isEditing() to \'false\' if current value is \'true\'', function () {
                viewModel.explanations()[0].isEditing(true);

                viewModel.deactivate();

                expect(viewModel.explanations()[0].isEditing()).toBe(false);
            });
        });

        describe('goToRelatedObjective', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('should track event \"Navigate to related objective\"', function () {
                viewModel.goToRelatedObjective();

                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to related objective', eventsCategory);
            });

            it('should navigate to objective', function () {
                viewModel.objectiveId = '0';

                viewModel.goToRelatedObjective();

                expect(router.navigateTo).toHaveBeenCalledWith('#/objective/0');
            });

        });

        describe('goToPreviousQuestion', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('should track event \"Navigate to previous question\"', function () {
                viewModel.objectiveId = '1';
                viewModel.hasPrevious = true;
                viewModel.previousId = 0;

                viewModel.goToPreviousQuestion();

                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous question', eventsCategory);
            });

            it('should navigate to previous question', function () {
                viewModel.objectiveId = '1';
                viewModel.hasPrevious = true;
                viewModel.previousId = 0;

                viewModel.goToPreviousQuestion();

                expect(router.navigateTo).toHaveBeenCalledWith('#/objective/1/question/0');
            });

            it('should navigate to #/404 if previous question doesnt exist', function () {
                viewModel.hasPrevious = false;

                viewModel.goToPreviousQuestion();

                expect(router.navigateTo).toHaveBeenCalledWith('#/404');
            });
        });

        describe('goToNextQuestion', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('should track event \'Navigate to next question\'', function () {
                viewModel.objectiveId = '1';
                viewModel.hasNext = true;
                viewModel.nextId = '1';

                viewModel.goToNextQuestion();

                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next question', eventsCategory);
            });

            it('should navigate to next question', function () {
                viewModel.objectiveId = '1';
                viewModel.hasNext = true;
                viewModel.nextId = '1';

                viewModel.goToNextQuestion();

                expect(router.navigateTo).toHaveBeenCalledWith('#/objective/1/question/1');
            });

            it('should throw if next question doesnt exist', function () {
                viewModel.hasNext = false;

                viewModel.goToNextQuestion();

                expect(router.navigateTo).toHaveBeenCalledWith('#/404');
            });
        });

        describe('toggle', function () {

            describe('answers', function () {

                it('should toggle false value', function () {
                    viewModel.isAnswersBlockExpanded(false);

                    viewModel.toggleAnswers();

                    expect(viewModel.isAnswersBlockExpanded()).toBe(true);
                });

                it('should toggle true value', function () {
                    viewModel.isAnswersBlockExpanded(true);

                    viewModel.toggleAnswers();

                    expect(viewModel.isAnswersBlockExpanded()).toBe(false);
                });
            });

            describe('explanations', function () {

                it('should toggle false value', function () {
                    viewModel.isExplanationsBlockExpanded(false);

                    viewModel.toggleExplanations();

                    expect(viewModel.isExplanationsBlockExpanded()).toBe(true);
                });

                it('should toggle true value', function () {
                    viewModel.isExplanationsBlockExpanded(true);

                    viewModel.toggleExplanations();

                    expect(viewModel.isExplanationsBlockExpanded()).toBe(false);
                });

                it('should finish editing on collapse', function () {
                    viewModel.isExplanationsBlockExpanded(true);
                    var explanation = {
                        text: ko.observable('Some text'),
                        isEditing: ko.observable(true),
                        id: '0'
                    };
                    viewModel.explanations([explanation]);

                    viewModel.toggleExplanations();

                    expect(explanation.isEditing()).toBeFalsy();
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
                                                 explanations: [
                                                     new explanationModel({
                                                         id: '0',
                                                         text: 'Default text1'
                                                     }),
                                                      new explanationModel({
                                                          id: '1',
                                                          text: 'Default text2'
                                                      })
                                                 ]
                                             })
                                         ]
                                 })];
                viewModel.activate({ id: '0', objectiveId: 'obj3' });

                jasmine.Clock.useMock();
            });

            describe('text', function () {

                it('should be observable', function () {
                    expect(ko.isObservable(viewModel.explanations()[0].text)).toBeTruthy();
                });

            });

            describe('isEditing', function () {

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
                                                    explanations: [
                                                   new explanationModel({
                                                       id: '0',
                                                       text: 'Default text1'
                                                   }),
                                                    new explanationModel({
                                                        id: '1',
                                                        text: 'Default text2'
                                                    })
                                                    ]
                                                })
                                            ]
                                    })];
                    viewModel.activate({ id: '0', objectiveId: 'obj3' });

                    jasmine.Clock.useMock();
                    spyOn(eventTracker, 'publish');
                });

                it('should have isEdititng observable', function () {
                    expect(ko.isObservable(viewModel.explanations()[0].isEditing)).toBeTruthy();
                });

                it('should send event \"Start editing explanation\" if true', function () {
                    viewModel.explanations()[0].isEditing(true);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Start editing explanation', eventsCategory);
                });

                it('should send event \"End editing explanation\" if false', function () {
                    viewModel.explanations()[0].isEditing(true);
                    eventTracker.publish.reset();

                    viewModel.explanations()[0].isEditing(false);

                    expect(eventTracker.publish).toHaveBeenCalledWith('End editing explanation', eventsCategory);
                });

            });

        });

        describe('canAddExplanation', function () {
            it('should be observable', function () {
                expect(ko.isObservable(viewModel.canAddExplanation)).toBe(true);
            });
        });

        describe('addExplanation', function () {

            beforeEach(function () {
                viewModel.explanations = ko.observableArray([]);
            });

            it('should be a function', function () {
                expect(viewModel.addExplanation).toEqual(jasmine.any(Function));
            });

            it('should send event \'Add explanation\'', function () {
                spyOn(eventTracker, 'publish');

                viewModel.addExplanation();

                expect(eventTracker.publish).toHaveBeenCalledWith('Add explanation', eventsCategory);
            });

            it('should add explanation to viewModel', function () {
                viewModel.addExplanation();

                expect(viewModel.explanations().length).toBe(1);
                expect(viewModel.explanations()[0].text).toBeDefined();
                expect(viewModel.explanations()[0].id).toBeDefined();
                expect(ko.isObservable(viewModel.explanations()[0].isEditing)).toBe(true);
            });

            it('should set isEditing observable to true for new explanation', function () {
                viewModel.addExplanation();

                expect(viewModel.explanations()[0].isEditing()).toBe(true);
            });
        });

        describe('canAddExplanation:', function () {

            describe('when explanation is just added', function () {

                it('should be false', function () {
                    viewModel.addExplanation();

                    expect(viewModel.canAddExplanation()).toBe(false);
                });

            });

            describe('when text of just added explanation is empty', function () {

                it('should be false', function () {
                    viewModel.explanations([]);
                    viewModel.addExplanation();
                    var explanation = viewModel.explanations()[0];

                    explanation.text('Some text');
                    explanation.text('');

                    expect(viewModel.canAddExplanation()).toBe(false);
                });

            });

            describe('when last added explanation was removed', function () {

                it('should be true', function () {
                    viewModel.explanations([]);
                    viewModel.addExplanation();
                    viewModel.deleteExplanation(viewModel.explanations()[0]);

                    expect(viewModel.canAddExplanation()).toBe(true);
                });

            });

            describe('when text from any explanation except last is empty', function () {

                it('should be true', function () {
                    viewModel.explanations([]);
                    viewModel.addExplanation();
                    var explanation = viewModel.explanations()[0];

                    viewModel.addExplanation();
                    viewModel.explanations()[1].text('Some text');

                    explanation.text('');

                    expect(viewModel.canAddExplanation()).toBe(true);
                });

            });

            describe('when text of last added explanation not empty', function () {

                it('should be true', function () {
                    viewModel.explanations([]);
                    viewModel.addExplanation();
                    var explanation = viewModel.explanations()[0];

                    explanation.text('Some text');

                    expect(viewModel.canAddExplanation()).toBe(true);
                });

            });

            describe('when text is empty after end editing', function () {

                it('should be true', function () {
                    viewModel.explanations([]);
                    viewModel.addExplanation();

                    var explanation = viewModel.explanations()[0];
                    explanation.text('Some text');
                    explanation.isEditing(false);
                    viewModel.saveExplanation(explanation);

                    explanation.text('');
                    expect(viewModel.canAddExplanation()).toBe(true);
                });

            });

        });

        describe('deleteExplanation', function () {

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
                                                 explanations: [
                                                     new explanationModel({
                                                         id: '0',
                                                         text: 'Default text1'
                                                     }),
                                                      new explanationModel({
                                                          id: '1',
                                                          text: 'Default text2'
                                                      })
                                                 ]
                                             })
                                         ]
                                 })];
                viewModel.activate({ id: '0', objectiveId: 'obj3' });
                spyOn(eventTracker, 'publish');
            });

            it('should be a function', function () {
                expect(viewModel.deleteExplanation).toEqual(jasmine.any(Function));
            });

            it('should send event \'Delete explanation\'', function () {
                viewModel.deleteExplanation(viewModel.explanations()[0]);
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete explanation', eventsCategory);
            });

            it('should delete explanation form viewModel', function () {
                var explanation = viewModel.explanations()[0];
                viewModel.deleteExplanation(explanation);

                expect(viewModel.explanations().indexOf(explanation)).toBe(-1);
            });

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

        beforeEach(function () {
            dataContext.objectives = [
                new objectiveModel({
                    id: 'obj3',
                    title: 'Test Objective',
                    image: images[0],
                    questions:
                    [
                        new questionModel({
                            id: '0',
                            title: 'Question 1',
                            answerOptions: [answer],
                            explanations: []
                        })
                    ]
                })];
            viewModel.activate({ id: '0', objectiveId: 'obj3' });

            spyOn(eventTracker, 'publish');
            spyOn(viewModel.notification, 'update');
            jasmine.Clock.useMock();
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

            it('the field [isCorrect] should be observable', function () {
                expect(ko.isObservable(viewModel.answerOptions()[0].isCorrect)).toBeTruthy();
            });

            it('should track event \"Change answer option correctness\"', function () {
                viewModel.toggleAnswerCorrectness(viewModel.answerOptions()[0]);

                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness', eventsCategory);
            });

            it('function [toggleAnswerCorrectness] should call nofification update', function () {
                viewModel.toggleAnswerCorrectness(viewModel.answerOptions()[0]);

                expect(viewModel.notification.update).toHaveBeenCalled();
            });

            it('should change option correctness', function () {
                viewModel.answerOptions()[0].isCorrect(false);

                viewModel.toggleAnswerCorrectness(viewModel.answerOptions()[0]);

                expect(viewModel.answerOptions()[0].isCorrect()).toBeTruthy();
            });

            it('should track event \"Save the answer option text\"', function () {
                viewModel.saveAnswerOption(viewModel.answerOptions()[0]);

                expect(eventTracker.publish).toHaveBeenCalledWith('Save the answer option text', eventsCategory);
            });

            it('function [saveAnswerOption] must not be called when text not changed', function () {
                spyOn(viewModel, 'saveAnswerOption');

                viewModel.answerOptions()[0].isInEdit(true);
                viewModel.answerOptions()[0].isInEdit(false);

                expect(viewModel.saveAnswerOption.calls.length).toEqual(0);
            });

            it('[isEmpty] property should be true when text is empty', function () {
                viewModel.answerOptions()[0].text('');

                expect(viewModel.answerOptions()[0].isEmpty()).toBeTruthy();
            });

            it('[isEmpty] property should be false when text is not empty', function () {
                viewModel.answerOptions()[0].text('some text');

                expect(viewModel.answerOptions()[0].isEmpty()).toBeFalsy();
            });

            it('function [saveAnswerOption] should call nofification update', function () {
                viewModel.answerOptions()[0].text('new text');
                viewModel.saveAnswerOption(viewModel.answerOptions()[0]);

                expect(viewModel.notification.update).toHaveBeenCalled();
            });

            it('should delete answer option when text is empty', function () {
                var answersCount = viewModel.answerOptions().length;

                viewModel.answerOptions()[0].isInEdit(true);
                viewModel.answerOptions()[0].text('');
                viewModel.answerOptions()[0].isInEdit(false);

                expect(viewModel.answerOptions().length).toBe(answersCount - 1);
            });

            it('should delete answer option when text contains only white-spaces and new lines codes', function () {
                var answersCount = viewModel.answerOptions().length;

                viewModel.answerOptions()[0].isInEdit(true);
                viewModel.answerOptions()[0].text('   \n  \n');
                viewModel.answerOptions()[0].isInEdit(false);

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
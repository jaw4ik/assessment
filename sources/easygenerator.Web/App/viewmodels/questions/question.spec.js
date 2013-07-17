define(function (require) {
    "use strict";

    var
        viewModel = require('viewModels/questions/question'),
        router = require('durandal/plugins/router'),
        dataContext = require('dataContext'),
        objectiveModel = require('models/objective'),
        questionModel = require('models/question'),
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
                
                expect(viewModel.answerOptions.lenght).toBe(question.answerOptions.lenght);
                expect(viewModel.explanations.lenght).toBe(question.explanations.lenght);
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

            it('should track event \"Navigate to next question\"', function () {
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
    });
});
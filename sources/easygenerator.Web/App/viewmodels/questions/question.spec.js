define(function (require) {
    "use strict";

    var
        viewModel = require('viewModels/questions/question'),
        router = require('plugins/router'),
        dataContext = require('dataContext'),
        objectiveModel = require('models/objective'),
        questionModel = require('models/question'),
        explanationModel = require('models/explanation'),
        answerOptionModel = require('models/answerOption'),
        images = require('configuration/images'),
        eventTracker = require('eventTracker'),
        questionRepository = require('repositories/questionRepository');

    var eventsCategory = 'Question';

    describe('viewModel [question]', function () {

        it('is defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('title:', function () {

            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });

            describe('isEditing', function () {
                it('should be observable', function () {
                    expect(viewModel.title.isEditing).toBeObservable();
                });
            });

            describe('isValid', function () {
                it('should be observable', function () {
                    expect(viewModel.title.isValid).toBeObservable();
                });

                describe('when title is empty', function () {
                    it('should be false', function () {
                        viewModel.title('');
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });
                });

                describe('when title is longer than 255', function () {
                    it('should be false', function () {
                        viewModel.title(utils.createString(256));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });
                });

                describe('when title is not empty and not longer than 255', function () {
                    it('should be true', function () {
                        viewModel.title(utils.createString(25));
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });
                });
            });
        });

        describe('questionTitleMaxLenth:', function() {
            it('should be defined', function() {
                expect(viewModel.questionTitleMaxLength).toBeDefined();
            });
            
            it('should be 255', function () {
                expect(viewModel.questionTitleMaxLength).toBe(255);
            });
        });

        describe('startEditQuestionTitle', function () {
            it('should be function', function () {
                expect(viewModel.startEditQuestionTitle).toBeFunction();
            });

            it('should set title.isEditing to true', function () {
                viewModel.title.isEditing(false);
                viewModel.startEditQuestionTitle();
                expect(viewModel.title.isEditing()).toBeTruthy();
            });
        });

        describe('endEditQuestionTitle', function () {
            var updateDeferred, getByIdDeferred;
            var question = { id: '0', title: 'lalala' };
            var objective = { id: 'testObj', questions: [question] };

            beforeEach(function () {
                updateDeferred = Q.defer();
                getByIdDeferred = Q.defer();
                spyOn(questionRepository, 'update').andReturn(updateDeferred.promise);
                spyOn(questionRepository, 'getById').andReturn(getByIdDeferred.promise);
                spyOn(eventTracker, 'publish');
                spyOn(viewModel.notification, 'update');

                dataContext.objectives = [objective];
                viewModel.activate(objective.id, question.id);
            });

            it('should be function', function () {
                expect(viewModel.endEditQuestionTitle).toBeFunction();
            });

            it('should send event \'Update question title\'', function () {
                viewModel.endEditQuestionTitle();
                expect(eventTracker.publish).toHaveBeenCalledWith('Update question title', eventsCategory);
            });

            it('should set title.isEditing to false', function () {
                viewModel.title.isEditing(true);
                viewModel.endEditQuestionTitle();
                expect(viewModel.title.isEditing()).toBeFalsy();
            });

            describe('when title is valid', function () {
                it('should update question in repository', function () {
                    viewModel.title(question.title);
                    viewModel.endEditQuestionTitle();
                    expect(questionRepository.update).toHaveBeenCalledWith(objective.id, { id: question.id, title: question.title });
                });

                describe('and when question updated successfully', function () {
                    it('should update notificaion', function () {
                        viewModel.title(question.title);
                        viewModel.endEditQuestionTitle();

                        var promise = updateDeferred.promise.finally(function () { });
                        updateDeferred.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.notification.update).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('when title is not valid', function () {
                it('should revert quiestion title value', function () {
                    viewModel.title('');
                    viewModel.endEditQuestionTitle();

                    var promise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.title()).toBe(question.title);
                    });
                });
            });
        });

        describe('activate:', function () {

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when objectiveId is not a string', function () {

                it('should navigate to #400', function () {
                    spyOn(router, 'navigate');

                    viewModel.activate(undefined, 'questiondId');

                    expect(router.navigate).toHaveBeenCalledWith('400');
                });

            });

            describe('when questionId is not a string', function () {

                it('should navigate to #/400', function () {
                    spyOn(router, 'navigate');

                    viewModel.activate('objectiveId', undefined);

                    expect(router.navigate).toHaveBeenCalledWith('400');
                });

            });

            describe('when objective not found', function () {

                it('should navigate to #404 when', function () {
                    spyOn(router, 'navigate');
                    dataContext.objectives = [];

                    viewModel.activate('objectiveId', 'questionId');

                    expect(router.navigate).toHaveBeenCalledWith('404');
                });

            });

            describe('when question not found', function () {

                it('should navigate to #404', function () {
                    spyOn(router, 'navigate');
                    dataContext.objectives = [
                        new objectiveModel({
                            id: 'obj1',
                            title: 'Test Objective',
                            image: images[0],
                            questions: []
                        })];

                    viewModel.activate('obj1', 'someId');

                    expect(router.navigate).toHaveBeenCalledWith('404');
                });

            });

            describe('when question is last', function () {

                it('should disable next', function () {
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

                    viewModel.activate('obj2', '0');

                    expect(viewModel.hasNext).toBe(false);
                });

            });

            describe('when question is first', function () {

                it('should disable previous', function () {
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

                    viewModel.activate('obj3', '0');

                    expect(viewModel.hasPrevious).toBe(false);
                });

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
                viewModel.activate(objective.id, question.id);

                //assert
                expect(viewModel.objectiveTitle).toBe(objective.title);
                expect(viewModel.title()).toBe(question.title);

                expect(viewModel.answerOptions().lenght).toBe(question.answerOptions.lenght);
                expect(viewModel.explanations().lenght).toBe(question.explanations.lenght);
                expect(viewModel.hasPrevious).toBe(true);
                expect(viewModel.hasNext).toBe(true);
            });
        });

        describe('deactivate:', function () {

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
                viewModel.activate('obj3', '0');
            });

            it('should be a function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should finish editing explanation', function () {
                viewModel.explanations()[0].isEditing(false);
                viewModel.deactivate();

                expect(viewModel.explanations()[0].isEditing()).toBe(false);
            });

            it('should remove subscribers from explanation', function () {
                var explanation = viewModel.explanations()[0];

                var disposeSpy = jasmine.createSpyObj('disposeSpy', ['dispose']);
                explanation.editingSubscription = disposeSpy;

                viewModel.deactivate();

                expect(disposeSpy.dispose).toHaveBeenCalled();
            });

        });

        describe('goToRelatedObjective:', function () {

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
                viewModel.activate('obj3', '0');

                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
            });

            it('should be a function', function () {
                expect(viewModel.goToRelatedObjective).toBeFunction();
            });

            it('should track event \"Navigate to related objective\"', function () {
                viewModel.goToRelatedObjective();

                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to related objective', eventsCategory);
            });

            it('should navigate to #objective/{objectiveId}', function () {
                viewModel.goToRelatedObjective();

                expect(router.navigate).toHaveBeenCalledWith('objective/obj3');
            });

        });

        describe('goToPreviousQuestion:', function () {

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
                                             }),
                                             new questionModel({
                                                 id: '1',
                                                 title: 'Question 2',
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
                viewModel.activate('obj3', '1');
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
            });

            it('should be a function', function () {
                expect(viewModel.goToPreviousQuestion).toBeFunction();
            });

            it('should track event \"Navigate to previous question\"', function () {
                viewModel.goToPreviousQuestion();

                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous question', eventsCategory);
            });

            it('should navigate to previous question', function () {
                viewModel.goToPreviousQuestion();

                expect(router.navigate).toHaveBeenCalledWith('objective/obj3/question/0');
            });

            describe('when previous question doesnt exist', function () {

                it('should navigate to #404 ', function () {
                    viewModel.hasPrevious = false;

                    viewModel.goToPreviousQuestion();

                    expect(router.navigate).toHaveBeenCalledWith('404');
                });

            });

        });

        describe('goToNextQuestion:', function () {

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
                                             }),
                                             new questionModel({
                                                 id: '1',
                                                 title: 'Question 2',
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
                viewModel.activate('obj3', '0');
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
            });

            it('should be a function', function () {
                expect(viewModel.goToNextQuestion).toBeFunction();
            });

            it('should track event \'Navigate to next question\'', function () {
                viewModel.goToNextQuestion();

                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next question', eventsCategory);
            });

            it('should navigate to next question', function () {
                viewModel.hasNext = true;

                viewModel.goToNextQuestion();

                expect(router.navigate).toHaveBeenCalledWith('objective/obj3/question/1');
            });

            describe('when next question doesnt exist', function () {

                it('should navigate to #404', function () {
                    viewModel.hasNext = false;

                    viewModel.goToNextQuestion();

                    expect(router.navigate).toHaveBeenCalledWith('404');
                });

            });

        });

        describe('toggleAnswers:', function () {

            it('should be a function', function () {
                expect(viewModel.toggleAnswers).toBeFunction();
            });

            describe('when called while answers block is expanded', function () {

                it('should collapse answers block', function () {
                    viewModel.isAnswersBlockExpanded(true);

                    viewModel.toggleAnswers();

                    expect(viewModel.isAnswersBlockExpanded()).toBe(false);
                });

            });

            describe('when called while answers block is collapsed', function () {

                it('should expand answers block', function () {
                    viewModel.isAnswersBlockExpanded(false);

                    viewModel.toggleAnswers();

                    expect(viewModel.isAnswersBlockExpanded()).toBe(true);
                });

            });

        });

        describe('toggleExplanations:', function () {

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
                viewModel.activate('obj3', '0');
            });

            it('should be a function', function () {
                expect(viewModel.toggleExplanations).toBeFunction();
            });

            describe('when called while explanations block is expanded', function () {

                it('should collapse explanations block', function () {
                    viewModel.isExplanationsBlockExpanded(true);

                    viewModel.toggleExplanations();

                    expect(viewModel.isExplanationsBlockExpanded()).toBe(false);
                });

                it('should finish editing', function () {
                    viewModel.isExplanationsBlockExpanded(true);
                    var explanation = viewModel.explanations()[0];
                    explanation.isEditing(true);

                    viewModel.toggleExplanations();

                    expect(explanation.isEditing()).toBeFalsy();
                });

            });

            describe('when called while explanations block is collapsed', function () {

                it('should expand explanations block', function () {
                    viewModel.isExplanationsBlockExpanded(false);

                    viewModel.toggleExplanations();

                    expect(viewModel.isExplanationsBlockExpanded()).toBe(true);
                });

            });

        });

        describe('explanations:', function () {

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
                viewModel.activate('obj3', '0');
            });

            it('should be observable', function () {
                expect(viewModel.explanations).toBeObservable();
            });

            describe('text:', function () {

                it('should be observable', function () {
                    expect(viewModel.explanations()[0].text).toBeObservable();
                });

            });

            describe('isEditing', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                });

                it('should be observable', function () {
                    expect(viewModel.explanations()[0].isEditing).toBeObservable();
                });

                describe('when start editing', function () {

                    it('should send event \"Start editing explanation\"', function () {
                        viewModel.explanations()[0].isEditing(true);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Start editing explanation', eventsCategory);
                    });

                });

                describe('when finish editing', function () {

                    it('should send event \"End editing explanation\"', function () {
                        viewModel.explanations()[0].isEditing(true);
                        eventTracker.publish.reset();

                        viewModel.explanations()[0].isEditing(false);

                        expect(eventTracker.publish).toHaveBeenCalledWith('End editing explanation', eventsCategory);
                    });

                });

            });

            describe('editingSubscription', function () {

                it('should be object', function () {
                    expect(viewModel.explanations()[0].editingSubscription).toBeObject();
                });

                it('should have dispose function', function () {
                    expect(viewModel.explanations()[0].editingSubscription.dispose).toBeFunction();
                });

            });

        });

        describe('addExplanation:', function () {

            beforeEach(function () {
                viewModel.explanations([]);
            });

            it('should be a function', function () {
                expect(viewModel.addExplanation).toBeFunction();
            });

            describe('when called', function () {

                it('should send event \'Add explanation\'', function () {
                    spyOn(eventTracker, 'publish');

                    viewModel.addExplanation();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Add explanation', eventsCategory);
                });

                it('should add explanation to viewModel', function () {
                    viewModel.explanations([]);
                    viewModel.addExplanation();

                    expect(viewModel.explanations().length).toBe(1);
                    expect(viewModel.explanations()[0].text).toBeDefined();
                    expect(viewModel.explanations()[0].id).toBeDefined();
                });

                it('should start editing new explanation', function () {
                    viewModel.addExplanation();

                    expect(viewModel.explanations()[0].isEditing()).toBe(true);
                });

                it('should have empty text', function () {
                    viewModel.addExplanation();

                    expect(viewModel.explanations()[0].text()).toBe('');
                });

            });

        });

        describe('canAddExplanation:', function () {

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
                viewModel.activate('obj3', '0');
            });

            it('should be computed', function () {
                expect(viewModel.canAddExplanation).toBeComputed();
            });

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

        describe('deleteExplanation:', function () {

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
                viewModel.activate('obj3', '0');
            });

            it('should be a function', function () {
                expect(viewModel.deleteExplanation).toBeFunction();
            });

            describe('when called', function () {

                it('should send event \'Delete explanation\'', function () {
                    spyOn(eventTracker, 'publish');
                    viewModel.deleteExplanation(viewModel.explanations()[0]);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete explanation', eventsCategory);
                });

                it('should delete explanation form viewModel', function () {
                    var explanation = {
                        text: ko.observable('Some text'),
                        isEditing: ko.observable(true),
                        id: '0'
                    };
                    viewModel.explanations([explanation]);
                    viewModel.deleteExplanation(explanation);

                    expect(viewModel.explanations().indexOf(explanation)).toBe(-1);
                });

            });

        });

        describe('language:', function () {

            it('should be observable', function () {
                expect(viewModel.language).toBeObservable();
            });

        });

        describe('saveExplanation:', function () {

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
                                                     })
                                                 ]
                                             })
                                         ]
                                 })];
                viewModel.activate('obj3', '0');
            });

            it('should be a function', function () {
                expect(viewModel.saveExplanation).toBeFunction();
            });

            describe('when called with empty text', function () {

                describe('and finished editing', function () {

                    it('should remove explanation from viewmodel', function () {
                        var explanation = viewModel.explanations()[0];
                        explanation.text(' ');
                        explanation.isEditing(false);
                        viewModel.saveExplanation(explanation);

                        expect(viewModel.explanations().indexOf(explanation)).toBe(-1);
                    });

                    it('should remove explanation from dataContext', function () {
                        var explanation = viewModel.explanations()[0];
                        explanation.text(' ');
                        explanation.isEditing(false);
                        viewModel.saveExplanation(explanation);

                        var explanationEntity = _.find(dataContext.objectives[0].questions[0].explanations, function (item) {
                            return item.id == explanation.id;
                        });

                        expect(explanationEntity).not.toBeDefined();
                    });

                    it('should remove subscriptions from explanation', function () {
                        var explanation = viewModel.explanations()[0];
                        explanation.text(' ');
                        explanation.isEditing(false);

                        var disposeSpy = jasmine.createSpyObj('disposeSpy', ['dispose']);
                        explanation.editingSubscription = disposeSpy;

                        viewModel.saveExplanation(explanation);

                        expect(disposeSpy.dispose).toHaveBeenCalled();
                    });

                });

            });

            describe('when called with not empty text', function () {

                describe('and explanation exists in data context', function () {

                    it('should save text', function () {
                        var explanation = viewModel.explanations()[0];
                        explanation.text('Some text');

                        viewModel.saveExplanation(explanation);

                        expect(dataContext.objectives[0].questions[0].explanations[0].text).toBe(explanation.text());
                    });

                });

                describe('and explanation does not exist in data context', function () {

                    it('should create explanation and save text', function () {
                        var explanation = viewModel.explanations()[0];
                        explanation.text('Some text');
                        explanation.id = 'newId';

                        viewModel.saveExplanation(explanation);

                        var savedExplanation = _.find(dataContext.objectives[0].questions[0].explanations, function (item) {
                            return item.id == explanation.id;
                        });

                        expect(savedExplanation).toBeDefined();
                        expect(savedExplanation.text).toBe(explanation.text());
                    });

                });

                it('should update notification', function () {
                    spyOn(viewModel.notification, 'update');

                    var explanation = viewModel.explanations()[0];
                    explanation.text('Some text');

                    viewModel.saveExplanation(explanation);

                    expect(viewModel.notification.update).toHaveBeenCalled();
                });
            });

        });

        describe('answerOptions:', function () {

            it('should be observable', function () {
                expect(viewModel.answerOptions).toBeObservable();
            });

        });

        describe('explanationAutosaveInterval:', function () {

            it('should be number', function () {
                expect(viewModel.explanationAutosaveInterval).toEqual(jasmine.any(Number));
            });

        });

        describe('eventTracker:', function () {

            it('should be object', function () {
                expect(viewModel.eventTracker).toBeObject();
            });

        });

        describe('notification:', function () {

            it('should be object', function () {
                expect(viewModel.notification).toBeObject();
            });

            it('should have text observable', function () {
                expect(viewModel.notification.text).toBeDefined();
                expect(viewModel.notification.text).toBeObservable();
            });

            it('should have visibility observable', function () {
                expect(viewModel.notification.visibility).toBeDefined();
                expect(viewModel.notification.visibility).toBeObservable();
            });

            describe('close', function () {

                it('should be function', function () {
                    expect(viewModel.notification.close).toBeFunction();
                });

                describe('when called', function () {

                    describe('and visibility is true', function () {

                        it('should set visibility to false', function () {
                            viewModel.notification.visibility(true);
                            viewModel.notification.close();

                            expect(viewModel.notification.visibility()).toBeFalsy();
                        });

                    });

                });

            });

            describe('update', function () {

                it('should be function', function () {
                    expect(viewModel.notification.update).toBeFunction();
                });

                describe('when called', function () {

                    describe('and visibility is false', function () {

                        it('should set visibility to true', function () {
                            viewModel.notification.visibility(false);
                            viewModel.notification.update();

                            expect(viewModel.notification.visibility()).toBeTruthy();
                        });

                    });

                });

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
                viewModel.activate('obj3', '0');

                spyOn(eventTracker, 'publish');
                spyOn(viewModel.notification, 'update');
            });

            describe('add', function () {

                it('[addAnswerOption] should be a function', function () {
                    expect(viewModel.addAnswerOption).toBeFunction();
                });

                it('[answerOptions] should be observable', function () {
                    expect(viewModel.answerOptions).toBeObservable();
                });

                it('should track event \"Add answer option\"', function () {
                    viewModel.addAnswerOption();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Add answer option', eventsCategory);
                });

                it('function [addAnswerOption] should create option', function () {
                    viewModel.answerOptions([]);
                    viewModel.addAnswerOption();

                    expect(viewModel.answerOptions().length).toBe(1);
                });
            });

            describe('edit', function () {

                it('the field [isCorrect] should be observable', function () {
                    expect(viewModel.answerOptions()[0].isCorrect).toBeObservable();
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
                    expect(viewModel.deleteAnswerOption).toBeFunction();
                });

                it('should delete item', function () {
                    var currentCount = viewModel.answerOptions().length;
                    viewModel.deleteAnswerOption(viewModel.answerOptions()[0]);

                    expect(viewModel.answerOptions().length).toBe(currentCount - 1);
                });
            });

        });

    });

});
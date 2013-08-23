define(function (require) {
    "use strict";

    var
        viewModel = require('viewModels/questions/question'),
        router = require('services/navigation'),
        objectiveModel = require('models/objective'),
        questionModel = require('models/question'),
        answerOptionModel = require('models/answerOption'),
        images = require('configuration/images'),
        eventTracker = require('eventTracker'),
        questionRepository = require('repositories/questionRepository'),
        objectiveRepository = require('repositories/objectiveRepository');

    var eventsCategory = 'Question';

    var question = {
        id: '1',
        title: 'lalala',
        createdOn: new Date(),
        modifiedOn: new Date(),
        answerOptions: [],
        explanations: []
    };

    var objective = {
        id: '0',
        questions: [question]
    };
    var objectiveFull = {
        id: '1',
        title: 'Test Objective',
        image: images[0],
        questions: [
            {
                id: '0',
                title: 'Question 1',
                answerOptions: [],
                explanations: []
            },
            question,
            {
                id: '2',
                title: 'Question 3',
                answerOptions: [],
                explanations: []
            }
        ]
    };

    describe('viewModel [question]', function () {

        it('is defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('modifiedOn:', function() {
            it('should be observable', function() {
                expect(viewModel.modifiedOn).toBeObservable();
            });
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
                        viewModel.title(utils.createString(viewModel.questionTitleMaxLength + 1));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when title is not empty and not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title(utils.createString(viewModel.questionTitleMaxLength - 1));
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });
            });
        });

        describe('questionTitleMaxLenth:', function () {

            it('should be defined', function () {
                expect(viewModel.questionTitleMaxLength).toBeDefined();
            });

            it('should be 255', function () {
                expect(viewModel.questionTitleMaxLength).toBe(255);
            });

        });

        describe('startEditQuestionTitle:', function () {

            it('should be function', function () {
                expect(viewModel.startEditQuestionTitle).toBeFunction();
            });

            it('should set title.isEditing to true', function () {
                viewModel.title.isEditing(false);
                viewModel.startEditQuestionTitle();
                expect(viewModel.title.isEditing()).toBeTruthy();
            });

        });

        describe('endEditQuestionTitle:', function () {

            var updateDeferred, getByIdDeferred;

            beforeEach(function () {
                updateDeferred = Q.defer();
                getByIdDeferred = Q.defer();

                spyOn(questionRepository, 'update').andReturn(updateDeferred.promise);
                spyOn(questionRepository, 'getById').andReturn(getByIdDeferred.promise);

                spyOn(eventTracker, 'publish');
                spyOn(viewModel.notification, 'update');
            });

            it('should be function', function () {
                expect(viewModel.endEditQuestionTitle).toBeFunction();
            });

            it('should set title.isEditing to false', function () {
                viewModel.title.isEditing(true);
                viewModel.endEditQuestionTitle();
                expect(viewModel.title.isEditing()).toBeFalsy();
            });

            describe('when title is not modified', function () {
                var promise = null;
                beforeEach(function () {
                    viewModel.title(question.title);
                    promise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(question);
                });

                it('should not send event', function () {
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(eventTracker.publish).not.toHaveBeenCalled();
                    });
                });

                it('should not show notification', function () {
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(viewModel.notification.update).not.toHaveBeenCalled();
                    });
                });

                it('should not update question in repository', function () {
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(questionRepository.update).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when title is modified', function () {

                var getPromise = null, newTitle = question.title + 'lala';
                beforeEach(function () {

                    viewModel.title(newTitle);
                    getPromise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(question);
                });

                it('should send event \'Update question title\'', function () {
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !getPromise.isPending();
                    });
                    runs(function () {
                        expect(getPromise).toBeResolved();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update question title', eventsCategory);
                    });
                });

                describe('and when title is valid', function () {

                    it('should update question in repository', function () {
                        viewModel.endEditQuestionTitle();
                        waitsFor(function () {
                            return !getPromise.isPending();
                        });
                        runs(function () {
                            expect(getPromise).toBeResolved();
                            expect(questionRepository.update).toHaveBeenCalled();
                            expect(questionRepository.update.mostRecentCall.args[1].title).toEqual(newTitle);
                        });
                    });

                    describe('and when question updated successfully', function () {

                        it('should update notificaion', function () {
                            viewModel.endEditQuestionTitle();

                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(question);

                            waitsFor(function () {
                                return !getPromise.isPending() && !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.notification.update).toHaveBeenCalled();
                            });
                        });
                        
                        it('should update modifiedOn', function () {
                            viewModel.endEditQuestionTitle();

                            var modificationDate = new Date();
                            question.modifiedOn = modificationDate;
                            
                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(question);

                            waitsFor(function () {
                                return !getPromise.isPending() && !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.modifiedOn()).toEqual(question.modifiedOn);
                            });
                        });
                    });

                });

                describe('and when title is not valid', function () {

                    it('should revert quiestion title value', function () {
                        viewModel.title('');
                        viewModel.endEditQuestionTitle();

                        waitsFor(function () {
                            return !getPromise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.title()).toBe(question.title);
                        });
                    });

                });
            });
        });

        describe('activate:', function () {

            var getQuestionByIdDeferred;
            var getObjectiveByIdDeferred;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getObjectiveByIdDeferred = Q.defer();

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferred.promise);
                spyOn(objectiveRepository, 'getById').andReturn(getObjectiveByIdDeferred.promise);
                spyOn(router, 'navigate');
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when objectiveId is not a string', function () {

                it('should navigate to #400', function () {
                    viewModel.activate(undefined, 'questiondId');

                    expect(router.navigate).toHaveBeenCalledWith('400');
                });

            });

            describe('when questionId is not a string', function () {

                it('should navigate to #/400', function () {
                    viewModel.activate('objectiveId', undefined);

                    expect(router.navigate).toHaveBeenCalledWith('400');
                });

            });

            describe('when objective not found', function () {

                it('should navigate to #404 when', function () {
                    var promise = viewModel.activate('objectiveId', 'questionId');
                    getObjectiveByIdDeferred.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });
                });

            });

            describe('when question not found', function () {

                it('should navigate to #404', function () {
                    var promise = viewModel.activate('obj1', 'someId');
                    getObjectiveByIdDeferred.resolve(objective);
                    getQuestionByIdDeferred.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });
                });

            });

            describe('when question is last', function () {

                it('should disable next', function () {
                    var promise = viewModel.activate('obj2', '0');

                    getObjectiveByIdDeferred.resolve(objective);
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.hasNext).toBe(false);
                    });
                });

            });

            describe('when question is first', function () {

                it('should disable previous', function () {
                    var promise = viewModel.activate('obj3', '0');
                    getObjectiveByIdDeferred.resolve(objective);
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.hasPrevious).toBe(false);
                    });
                });

            });

            it('should initialize fields', function () {
                var promise = viewModel.activate(objective.id, question.id);

                getObjectiveByIdDeferred.resolve(objectiveFull);
                getQuestionByIdDeferred.resolve(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.objectiveTitle).toBe(objectiveFull.title);
                    expect(viewModel.title()).toBe(question.title);
                    expect(viewModel.createdOn).toBe(question.createdOn);
                    expect(viewModel.modifiedOn()).toBe(question.modifiedOn);

                    expect(viewModel.answerOptions().lenght).toBe(question.answerOptions.lenght);
                    expect(viewModel.explanations().lenght).toBe(question.explanations.lenght);
                    expect(viewModel.hasPrevious).toBe(true);
                    expect(viewModel.hasNext).toBe(true);
                });
            });
        });

        describe('deactivate:', function () {

            it('should be a function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should finish editing explanation', function () {
                viewModel.explanations([{ isEditing: ko.observable(false) }]);
                viewModel.deactivate();

                expect(viewModel.explanations()[0].isEditing()).toBe(false);
            });

            it('should remove subscribers from explanation', function () {
                var explanation = {
                    isEditing: ko.observable(true),
                    editingSubscription: jasmine.createSpyObj('disposeSpy', ['dispose'])
                };
                viewModel.explanations([explanation]);

                viewModel.deactivate();

                expect(explanation.editingSubscription.dispose).toHaveBeenCalled();
            });

        });

        describe('goToCreateQuestion:', function () {
            
            beforeEach(function () {
                spyOn(router, 'navigate');
                spyOn(eventTracker, 'publish');
            });

            it('should be a function', function () {
                expect(viewModel.goToCreateQuestion).toBeFunction();
            });

            it('should track event \"Navigate to create question\"', function () {
                viewModel.goToCreateQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create question', eventsCategory);
            });

            it('should navigate to #objective/{objectiveId}', function () {
                viewModel.goToCreateQuestion();
                expect(router.navigate).toHaveBeenCalled();
            });

        });

        describe('goToRelatedObjective:', function () {

            beforeEach(function () {
                spyOn(router, 'navigate');
                spyOn(eventTracker, 'publish');
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
                expect(router.navigate).toHaveBeenCalled();
            });

        });

        describe('goToPreviousQuestion:', function () {

            beforeEach(function () {
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
                expect(router.navigate).toHaveBeenCalled();
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
                expect(router.navigate).toHaveBeenCalled();
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

                    var explanation = {
                        text: ko.observable('Some text'),
                        isEditing: ko.observable(true),
                        id: '0'
                    };
                    viewModel.explanations([explanation]);

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

        xdescribe('explanations:', function () {

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

                var getQuestionByIdDeferred;
                var getQuestionByIdDeferredPromise;

                beforeEach(function () {
                    getQuestionByIdDeferred = Q.defer();
                    getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                    spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
                });

                it('should be true', function () {
                    viewModel.explanations([]);
                    viewModel.addExplanation();
                    viewModel.deleteExplanation(viewModel.explanations()[0]);
                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.canAddExplanation()).toBe(true);
                    });
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

            it('should be a function', function () {
                expect(viewModel.deleteExplanation).toBeFunction();
            });

            describe('when called', function () {

                var getQuestionByIdDeferred;
                var getQuestionByIdDeferredPromise;

                beforeEach(function () {
                    getQuestionByIdDeferred = Q.defer();
                    getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                    spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
                });

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

                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.explanations().indexOf(explanation)).toBe(-1);
                    });
                });

            });

        });

        describe('language:', function () {

            it('should be observable', function () {
                expect(viewModel.language).toBeObservable();
            });

        });

        describe('saveExplanation:', function () {

            var getQuestionByIdDeferred;
            var getQuestionByIdDeferredPromise;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
            });

            it('should be a function', function () {
                expect(viewModel.saveExplanation).toBeFunction();
            });

            describe('when called with empty text', function () {

                describe('and finished editing', function () {

                    it('should remove explanation from viewmodel', function () {
                        var explanation = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };
                        viewModel.explanations([explanation]);
                        explanation.text(' ');
                        explanation.isEditing(false);
                        viewModel.saveExplanation(explanation);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.explanations().indexOf(explanation)).toBe(-1);
                        });

                    });

                    it('should remove explanation from repository', function () {
                        var explanation = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };

                        var testQuestion = {
                            id: '1',
                            title: 'lalala',
                            answerOptions: [],
                            explanations: [explanation]
                        };

                        viewModel.explanations([explanation]);
                        explanation.text(' ');
                        explanation.isEditing(false);
                        viewModel.saveExplanation(explanation);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(testQuestion);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(testQuestion.explanations.length).toEqual(0);
                        });
                    });

                    it('should remove subscriptions from explanation', function () {
                        var explanation = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };
                        viewModel.explanations([explanation]);

                        explanation.text(' ');
                        explanation.isEditing(false);

                        var disposeSpy = jasmine.createSpyObj('disposeSpy', ['dispose']);
                        explanation.editingSubscription = disposeSpy;

                        viewModel.saveExplanation(explanation);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(disposeSpy.dispose).toHaveBeenCalled();
                        });
                    });

                });

            });

            describe('when called with not empty text', function () {

                describe('and explanation exists in data context', function () {

                    it('should save text', function () {
                        var explanation = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };
                        viewModel.explanations([explanation]);

                        viewModel.explanations()[0].text('Some text');

                        viewModel.saveExplanation(explanation);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.explanations()[0].text()).toBe(explanation.text());
                        });
                    });

                });

                describe('and explanation does not exist in data context', function () {

                    it('should create explanation and save text', function () {
                        var explanation = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };

                        var testQuestion = {
                            id: '1',
                            title: 'lalala',
                            answerOptions: [],
                            explanations: []
                        };

                        viewModel.explanations([explanation]);

                        viewModel.saveExplanation(explanation);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(testQuestion);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(testQuestion.explanations[0]).toBeDefined();
                            expect(testQuestion.explanations[0].text).toBe(explanation.text());
                        });
                    });

                });

                it('should update notification', function () {
                    spyOn(viewModel.notification, 'update');

                    var explanation = {
                        text: ko.observable('Some text'),
                        isEditing: ko.observable(true),
                        id: '0'
                    };
                    viewModel.explanations([explanation]);

                    explanation.text('Some text');

                    viewModel.saveExplanation(explanation);

                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.notification.update).toHaveBeenCalled();
                    });
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

        describe('addAnswerOption:', function () {

            var getQuestionByIdDeferred;
            var getQuestionByIdDeferredPromise;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
                spyOn(eventTracker, 'publish');
            });

            it('should be function', function () {
                expect(viewModel.addAnswerOption).toBeFunction();
            });

            it('should send event \'Add answer option\'', function () {
                viewModel.addAnswerOption();
                expect(eventTracker.publish).toHaveBeenCalledWith('Add answer option', eventsCategory);
            });

            it('should get question from repository', function () {
                viewModel.addAnswerOption();

                expect(questionRepository.getById).toHaveBeenCalled();
            });

            it('should add new answer option to repository', function () {
                var newQuestion = {
                    id: '2',
                    title: 'Some text',
                    answerOptions: [],
                    explanations: []
                };

                viewModel.addAnswerOption();

                var promise = getQuestionByIdDeferredPromise.fin(function () { });
                getQuestionByIdDeferred.resolve(newQuestion);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(newQuestion.answerOptions.length).toEqual(1);
                });
            });

            it('should add new answer option to viewModel', function () {
                var newQuestion = {
                    id: '2',
                    title: 'Some text',
                    answerOptions: [],
                    explanations: []
                };

                viewModel.answerOptions([]);

                viewModel.addAnswerOption();

                var promise = getQuestionByIdDeferredPromise.fin(function () { });
                getQuestionByIdDeferred.resolve(newQuestion);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.answerOptions().length).toEqual(1);
                });
            });

            describe('when new answer option added', function () {

                var addPromise;

                beforeEach(function () {
                    viewModel.answerOptions([]);
                    viewModel.addAnswerOption();

                    addPromise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve({
                        id: '1',
                        title: 'lalala',
                        answerOptions: [],
                        explanations: []
                    });
                });

                it('should have empty text', function () {
                    waitsFor(function () {
                        return !addPromise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.answerOptions()[0].text).toBeObservable();
                        expect(viewModel.answerOptions()[0].text().length).toEqual(0);
                    });
                });

                it('should add isInEdit observable', function () {
                    waitsFor(function () {
                        return !addPromise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.answerOptions()[0].isInEdit).toBeObservable();
                    });
                });

                it('should add isEmpty observable', function () {
                    waitsFor(function () {
                        return !addPromise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.answerOptions()[0].isEmpty).toBeObservable();
                    });
                });

            });

        });

        describe('toggleAnswerCorrectness:', function () {

            var getQuestionByIdDeferred;
            var getQuestionByIdDeferredPromise;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
                spyOn(eventTracker, 'publish');
                spyOn(viewModel.notification, 'update');
            });

            it('should be function', function () {
                expect(viewModel.toggleAnswerCorrectness).toBeFunction();
            });

            it('should send event \'Change answer option correctness\'', function () {
                viewModel.toggleAnswerCorrectness();
                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness', eventsCategory);
            });

            it('should get question from repository', function () {
                viewModel.toggleAnswerCorrectness();

                expect(questionRepository.getById).toHaveBeenCalled();
            });

            it('should update notification', function () {
                var answerOption = {
                    id: 0,
                    text: 'Some text',
                    isCorrect: true
                };

                var question = {
                    id: '1',
                    title: 'lalala',
                    answerOptions: [answerOption],
                    explanations: []
                };

                var mappedAnswerOption = {
                    id: answerOption.id,
                    text: ko.observable(answerOption.text),
                    isCorrect: ko.observable(answerOption.text)
                };

                viewModel.answerOptions([mappedAnswerOption]);

                viewModel.toggleAnswerCorrectness(mappedAnswerOption);

                var promise = getQuestionByIdDeferredPromise.fin(function () { });
                getQuestionByIdDeferred.resolve(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.notification.update).toHaveBeenCalled();
                });

            });

            describe('when answerOption is correct', function () {

                it('should make it incorrect in repository', function () {
                    var answerOption = {
                        id: 0,
                        text: 'Some text',
                        isCorrect: true
                    };

                    var question = {
                        id: '1',
                        title: 'lalala',
                        answerOptions: [answerOption],
                        explanations: []
                    };

                    var mappedAnswerOption = {
                        id: answerOption.id,
                        text: ko.observable(answerOption.text),
                        isCorrect: ko.observable(answerOption.text)
                    };

                    viewModel.answerOptions([mappedAnswerOption]);

                    viewModel.toggleAnswerCorrectness(mappedAnswerOption);

                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(answerOption.isCorrect).toBeFalsy();
                    });

                });

                it('should make it incorrect in viewModel', function () {
                    var answerOption = {
                        id: 0,
                        text: 'Some text',
                        isCorrect: true
                    };

                    var question = {
                        id: '1',
                        title: 'lalala',
                        answerOptions: [answerOption],
                        explanations: []
                    };

                    var mappedAnswerOption = {
                        id: answerOption.id,
                        text: ko.observable(answerOption.text),
                        isCorrect: ko.observable(answerOption.text)
                    };

                    viewModel.answerOptions([mappedAnswerOption]);

                    viewModel.toggleAnswerCorrectness(mappedAnswerOption);

                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(mappedAnswerOption.isCorrect()).toBeFalsy();
                    });

                });

            });

            describe('when answerOption is incorrect', function () {

                it('should make it correct in repository', function () {
                    var answerOption = {
                        id: 0,
                        text: 'Some text',
                        isCorrect: false
                    };

                    var question = {
                        id: '1',
                        title: 'lalala',
                        answerOptions: [answerOption],
                        explanations: []
                    };

                    var mappedAnswerOption = {
                        id: answerOption.id,
                        text: ko.observable(answerOption.text),
                        isCorrect: ko.observable(answerOption.text)
                    };

                    viewModel.answerOptions([mappedAnswerOption]);

                    viewModel.toggleAnswerCorrectness(mappedAnswerOption);

                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(answerOption.isCorrect).toBeTruthy();
                    });

                });

                it('should make it correct in viewModel', function () {
                    var answerOption = {
                        id: 0,
                        text: 'Some text',
                        isCorrect: false
                    };

                    var question = {
                        id: '1',
                        title: 'lalala',
                        answerOptions: [answerOption],
                        explanations: []
                    };

                    var mappedAnswerOption = {
                        id: answerOption.id,
                        text: ko.observable(answerOption.text),
                        isCorrect: ko.observable(answerOption.text)
                    };

                    viewModel.answerOptions([mappedAnswerOption]);

                    viewModel.toggleAnswerCorrectness(mappedAnswerOption);

                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(mappedAnswerOption.isCorrect()).toBeTruthy();
                    });

                });

            });

        });

        describe('saveAnswerOption:', function () {

            var getQuestionByIdDeferred;
            var getQuestionByIdDeferredPromise;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
                spyOn(eventTracker, 'publish');
                spyOn(viewModel.notification, 'update');
            });

            it('should be function', function () {
                expect(viewModel.saveAnswerOption).toBeFunction();
            });

            it('should send event \'Save the answer option text\'', function () {
                viewModel.saveAnswerOption();
                expect(eventTracker.publish).toHaveBeenCalledWith('Save the answer option text', eventsCategory);
            });

            it('should get question from repository', function () {
                viewModel.saveAnswerOption();
                expect(questionRepository.getById).toHaveBeenCalled();
            });

            it('should save text in repository', function () {
                var answerOption = {
                    id: 0,
                    text: 'Some text',
                    isCorrect: true
                };

                var question = {
                    id: '1',
                    title: 'lalala',
                    answerOptions: [answerOption],
                    explanations: []
                };

                var mappedAnswerOption = {
                    id: answerOption.id,
                    text: ko.observable(answerOption.text),
                    isCorrect: ko.observable(answerOption.text)
                };

                viewModel.answerOptions([mappedAnswerOption]);

                mappedAnswerOption.text('Some new text');

                viewModel.saveAnswerOption(mappedAnswerOption);

                var promise = getQuestionByIdDeferredPromise.fin(function () { });
                getQuestionByIdDeferred.resolve(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(mappedAnswerOption.text()).toEqual(answerOption.text);
                });

            });

            it('should update notification', function () {
                var answerOption = {
                    id: 0,
                    text: 'Some text',
                    isCorrect: true
                };

                var question = {
                    id: '1',
                    title: 'lalala',
                    answerOptions: [answerOption],
                    explanations: []
                };

                var mappedAnswerOption = {
                    id: answerOption.id,
                    text: ko.observable(answerOption.text),
                    isCorrect: ko.observable(answerOption.text)
                };

                viewModel.answerOptions([mappedAnswerOption]);

                mappedAnswerOption.text('Some new text');

                viewModel.saveAnswerOption(mappedAnswerOption);

                var promise = getQuestionByIdDeferredPromise.fin(function () { });
                getQuestionByIdDeferred.resolve(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.notification.update).toHaveBeenCalled();
                });

            });

        });

        describe('deleteAnswerOption:', function () {

            var getQuestionByIdDeferred;
            var getQuestionByIdDeferredPromise;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
                spyOn(eventTracker, 'publish');
                spyOn(viewModel.notification, 'update');
            });

            it('should be function', function () {
                expect(viewModel.deleteAnswerOption).toBeFunction();
            });

            it('should send event \'Delete answer option\'', function () {
                viewModel.deleteAnswerOption();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option', eventsCategory);
            });

            it('should get question from repository', function () {
                viewModel.deleteAnswerOption();
                expect(questionRepository.getById).toHaveBeenCalled();
            });

            it('should delete answer option from repository', function () {
                var answerOption = {
                    id: 0,
                    text: 'Some text',
                    isCorrect: true
                };

                var question = {
                    id: '1',
                    title: 'lalala',
                    answerOptions: [answerOption],
                    explanations: []
                };

                var mappedAnswerOption = {
                    id: answerOption.id,
                    text: ko.observable(answerOption.text),
                    isCorrect: ko.observable(answerOption.text)
                };

                viewModel.answerOptions([mappedAnswerOption]);

                viewModel.deleteAnswerOption(mappedAnswerOption);

                var promise = getQuestionByIdDeferredPromise.fin(function () { });
                getQuestionByIdDeferred.resolve(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(question.answerOptions.length).toEqual(0);
                });

            });

            it('should delete answer option from viewModel', function () {
                var answerOption = {
                    id: 0,
                    text: 'Some text',
                    isCorrect: true
                };

                var question = {
                    id: '1',
                    title: 'lalala',
                    answerOptions: [answerOption],
                    explanations: []
                };

                var mappedAnswerOption = {
                    id: answerOption.id,
                    text: ko.observable(answerOption.text),
                    isCorrect: ko.observable(answerOption.text)
                };

                viewModel.answerOptions([mappedAnswerOption]);

                viewModel.deleteAnswerOption(mappedAnswerOption);

                var promise = getQuestionByIdDeferredPromise.fin(function () { });
                getQuestionByIdDeferred.resolve(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.answerOptions().length).toEqual(0);
                });

            });

            it('should update notification', function () {
                var answerOption = {
                    id: 0,
                    text: 'Some text',
                    isCorrect: true
                };

                var question = {
                    id: '1',
                    title: 'lalala',
                    answerOptions: [answerOption],
                    explanations: []
                };

                var mappedAnswerOption = {
                    id: answerOption.id,
                    text: ko.observable(answerOption.text),
                    isCorrect: ko.observable(answerOption.text)
                };

                viewModel.answerOptions([mappedAnswerOption]);

                viewModel.deleteAnswerOption(mappedAnswerOption);

                var promise = getQuestionByIdDeferredPromise.fin(function () { });
                getQuestionByIdDeferred.resolve(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.notification.update).toHaveBeenCalled();
                });

            });
        });

    });

});
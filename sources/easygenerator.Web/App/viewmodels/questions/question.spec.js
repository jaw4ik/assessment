define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/questions/question'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        questionRepository = require('repositories/questionRepository'),
        objectiveRepository = require('repositories/objectiveRepository'),
        notify = require('notify');

    var question = {
        id: '1',
        title: 'lalala',
        createdOn: new Date(),
        modifiedOn: new Date(),
        answerOptions: [],
        learningObjects: []
    };

    var objective = {
        id: '0',
        questions: [question]
    };
    var objectiveFull = {
        id: '1',
        title: 'Test Objective',
        image: 'some image url',
        questions: [
            {
                id: '0',
                title: 'Question 1',
                answerOptions: [],
                learningObjects: []
            },
            question,
            {
                id: '2',
                title: 'Question 3',
                answerOptions: [],
                learningObjects: []
            }
        ]
    };

    describe('viewModel [question]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'navigateWithQueryString');
            spyOn(router, 'replace');
        });

        it('is defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('modifiedOn:', function () {
            it('should be observable', function () {
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

                it('should be computed', function () {
                    expect(viewModel.title.isValid).toBeComputed();
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

                describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title('   ' + utils.createString(viewModel.questionTitleMaxLength - 1) + '   ');
                        expect(viewModel.title.isValid()).toBeTruthy();
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

        describe('questionTitleMaxLength:', function () {

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

                spyOn(questionRepository, 'updateTitle').andReturn(updateDeferred.promise);
                spyOn(questionRepository, 'getById').andReturn(getByIdDeferred.promise);
            });

            it('should be function', function () {
                expect(viewModel.endEditQuestionTitle).toBeFunction();
            });

            it('should set title.isEditing to false', function () {
                viewModel.title.isEditing(true);
                viewModel.endEditQuestionTitle();
                expect(viewModel.title.isEditing()).toBeFalsy();
            });

            it('should trim title', function() {
                viewModel.title('    Some title    ');
                viewModel.endEditQuestionTitle();
                expect(viewModel.title()).toEqual('Some title');
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
                    spyOn(notify, 'info');
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(notify.info).not.toHaveBeenCalled();
                    });
                });

                it('should not update question in repository', function () {
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(questionRepository.updateTitle).not.toHaveBeenCalled();
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
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update question title');
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
                            expect(questionRepository.updateTitle).toHaveBeenCalled();
                            expect(questionRepository.updateTitle.mostRecentCall.args[1]).toEqual(newTitle);
                        });
                    });

                    describe('and when question updated successfully', function () {

                        it('should update notificaion', function () {
                            spyOn(notify, 'info');

                            viewModel.endEditQuestionTitle();

                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(question);

                            waitsFor(function () {
                                return !getPromise.isPending() && !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should update modifiedOn', function () {
                            viewModel.endEditQuestionTitle();

                            var modificationDate = new Date();
                            question.modifiedOn = modificationDate;

                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(modificationDate);

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
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when objectiveId is not a string', function () {

                it('should navigate to #400', function () {
                    viewModel.activate(undefined, 'questiondId');

                    expect(router.replace).toHaveBeenCalledWith('400');
                });

            });

            describe('when questionId is not a string', function () {

                it('should navigate to #/400', function () {
                    viewModel.activate('objectiveId', undefined);
                    expect(router.replace).toHaveBeenCalledWith('400');
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
                        expect(router.replace).toHaveBeenCalledWith('404');
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
                        expect(router.replace).toHaveBeenCalledWith('404');
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

                    expect(viewModel.answerOptions().length).toBe(question.answerOptions.length);
                    expect(viewModel.learningObjects().length).toBe(question.learningObjects.length);
                    expect(viewModel.hasPrevious).toBe(true);
                    expect(viewModel.hasNext).toBe(true);
                });
            });
        });

        describe('deactivate:', function () {

            it('should be a function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should finish editing learning object', function () {
                viewModel.learningObjects([{ isEditing: ko.observable(false) }]);
                viewModel.deactivate();

                expect(viewModel.learningObjects()[0].isEditing()).toBe(false);
            });

            it('should remove subscribers from learning object', function () {
                var learningObject = {
                    isEditing: ko.observable(true),
                    editingSubscription: jasmine.createSpyObj('disposeSpy', ['dispose'])
                };
                viewModel.learningObjects([learningObject]);

                viewModel.deactivate();

                expect(learningObject.editingSubscription.dispose).toHaveBeenCalled();
            });

            it('should finish editing answer options', function() {
                viewModel.answerOptions([{ isInEdit: ko.observable(true) }]);
                viewModel.deactivate();

                expect(viewModel.answerOptions()[0].isInEdit()).toBeFalsy();
            });

            it('should dispose answer options subscriptions', function() {
                viewModel.answerOptions([{
                    isInEdit: ko.observable(false),
                    _subscriptions: [jasmine.createSpyObj('answerOptionDispose', ['dispose'])]
                }]);

                viewModel.deactivate();

                expect(viewModel.answerOptions()[0]._subscriptions[0].dispose).toHaveBeenCalled();
            });

        });

        describe('goToCreateQuestion:', function () {

            it('should be a function', function () {
                expect(viewModel.goToCreateQuestion).toBeFunction();
            });

            it('should track event \"Navigate to create question\"', function () {
                viewModel.goToCreateQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create question');
            });

            it('should navigate to #objective/{objectiveId}', function () {
                viewModel.goToCreateQuestion();
                expect(router.navigateWithQueryString).toHaveBeenCalled();
            });

        });

        describe('goToRelatedObjective:', function () {

            it('should be a function', function () {
                expect(viewModel.goToRelatedObjective).toBeFunction();
            });

            it('should track event \"Navigate to related objective\"', function () {
                viewModel.goToRelatedObjective();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to related objective');
            });

            it('should navigate to #objective/{objectiveId}', function () {
                viewModel.goToRelatedObjective();
                expect(router.navigateWithQueryString).toHaveBeenCalled();
            });

        });

        describe('goToPreviousQuestion:', function () {

            it('should be a function', function () {
                expect(viewModel.goToPreviousQuestion).toBeFunction();
            });

            it('should track event \"Navigate to previous question\"', function () {
                viewModel.goToPreviousQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous question');
            });

            it('should navigate to previous question', function () {
                viewModel.goToPreviousQuestion();
                expect(router.navigateWithQueryString).toHaveBeenCalled();
            });

            describe('when previous question doesnt exist', function () {

                it('should navigate to #404 ', function () {
                    viewModel.hasPrevious = false;
                    viewModel.goToPreviousQuestion();
                    expect(router.replace).toHaveBeenCalledWith('404');
                });

            });

        });

        describe('goToNextQuestion:', function () {

            it('should be a function', function () {
                expect(viewModel.goToNextQuestion).toBeFunction();
            });

            it('should track event \'Navigate to next question\'', function () {
                viewModel.goToNextQuestion();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next question');
            });

            it('should navigate to next question', function () {
                viewModel.hasNext = true;
                viewModel.goToNextQuestion();
                expect(router.navigateWithQueryString).toHaveBeenCalled();
            });

            describe('when next question doesnt exist', function () {

                it('should navigate to #404', function () {
                    viewModel.hasNext = false;
                    viewModel.goToNextQuestion();
                    expect(router.replace).toHaveBeenCalledWith('404');
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

        describe('toggleLearningObjects:', function () {

            it('should be a function', function () {
                expect(viewModel.toggleLearningObjects).toBeFunction();
            });

            describe('when called while learning objects block is expanded', function () {

                it('should collapse learning objects block', function () {
                    viewModel.isLearningObjectsBlockExpanded(true);
                    viewModel.toggleLearningObjects();
                    expect(viewModel.isLearningObjectsBlockExpanded()).toBe(false);
                });

                it('should finish editing', function () {
                    viewModel.isLearningObjectsBlockExpanded(true);

                    var learningObject = {
                        text: ko.observable('Some text'),
                        isEditing: ko.observable(true),
                        id: '0'
                    };
                    viewModel.learningObjects([learningObject]);

                    learningObject.isEditing(true);

                    viewModel.toggleLearningObjects();

                    expect(learningObject.isEditing()).toBeFalsy();
                });

            });

            describe('when called while learning objects block is collapsed', function () {

                it('should expand learning objects block', function () {
                    viewModel.isLearningObjectsBlockExpanded(false);

                    viewModel.toggleLearningObjects();

                    expect(viewModel.isLearningObjectsBlockExpanded()).toBe(true);
                });

            });

        });

        xdescribe('learningObjects:', function () {

            it('should be observable', function () {
                expect(viewModel.learningObjects).toBeObservable();
            });

            describe('text:', function () {

                it('should be observable', function () {
                    expect(viewModel.learningObjects()[0].text).toBeObservable();
                });

            });

            describe('isEditing', function () {

                it('should be observable', function () {
                    expect(viewModel.learningObjects()[0].isEditing).toBeObservable();
                });

                describe('when start editing', function () {

                    it('should send event \"Start editing learning object\"', function () {
                        viewModel.learningObjects()[0].isEditing(true);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Start editing learning object');
                    });

                });

                describe('when finish editing', function () {

                    it('should send event \"End editing learning object\"', function () {
                        viewModel.learningObjects()[0].isEditing(true);
                        eventTracker.publish.reset();

                        viewModel.learningObjects()[0].isEditing(false);

                        expect(eventTracker.publish).toHaveBeenCalledWith('End editing learning object');
                    });

                });

            });

            describe('editingSubscription', function () {

                it('should be object', function () {
                    expect(viewModel.learningObjects()[0].editingSubscription).toBeObject();
                });

                it('should have dispose function', function () {
                    expect(viewModel.learningObjects()[0].editingSubscription.dispose).toBeFunction();
                });

            });

        });

        describe('addLearningObject:', function () {

            beforeEach(function () {
                viewModel.learningObjects([]);
            });

            it('should be a function', function () {
                expect(viewModel.addLearningObject).toBeFunction();
            });

            describe('when called', function () {

                it('should send event \'Add learning object\'', function () {
                    viewModel.addLearningObject();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Add learning object');
                });

                it('should add learning object to viewModel', function () {
                    viewModel.learningObjects([]);
                    viewModel.addLearningObject();

                    expect(viewModel.learningObjects().length).toBe(1);
                    expect(viewModel.learningObjects()[0].text).toBeDefined();
                    expect(viewModel.learningObjects()[0].id).toBeDefined();
                });

                it('should start editing new learning object', function () {
                    viewModel.addLearningObject();

                    expect(viewModel.learningObjects()[0].isEditing()).toBe(true);
                });

                it('should have empty text', function () {
                    viewModel.addLearningObject();

                    expect(viewModel.learningObjects()[0].text()).toBe('');
                });

            });

        });

        describe('canAddLearningObject:', function () {

            it('should be computed', function () {
                expect(viewModel.canAddLearningObject).toBeComputed();
            });

            describe('when learning object is just added', function () {

                it('should be false', function () {
                    viewModel.addLearningObject();

                    expect(viewModel.canAddLearningObject()).toBe(false);
                });

            });

            describe('when text of just added learning object is empty', function () {

                it('should be false', function () {
                    viewModel.learningObjects([]);
                    viewModel.addLearningObject();
                    var learningObject = viewModel.learningObjects()[0];

                    learningObject.text('Some text');
                    learningObject.text('');

                    expect(viewModel.canAddLearningObject()).toBe(false);
                });

            });

            describe('when last added learning object was removed', function () {

                var getQuestionByIdDeferred;
                var getQuestionByIdDeferredPromise;

                beforeEach(function () {
                    getQuestionByIdDeferred = Q.defer();
                    getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                    spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
                });

                it('should be true', function () {
                    viewModel.learningObjects([]);
                    viewModel.addLearningObject();
                    viewModel.deleteLearningObject(viewModel.learningObjects()[0]);
                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.canAddLearningObject()).toBe(true);
                    });
                });

            });

            describe('when text from any learning object except last is empty', function () {

                it('should be true', function () {
                    viewModel.learningObjects([]);
                    viewModel.addLearningObject();
                    var learningObject = viewModel.learningObjects()[0];

                    viewModel.addLearningObject();
                    viewModel.learningObjects()[1].text('Some text');

                    learningObject.text('');

                    expect(viewModel.canAddLearningObject()).toBe(true);
                });

            });

            describe('when text of last added learning object not empty', function () {

                it('should be true', function () {
                    viewModel.learningObjects([]);
                    viewModel.addLearningObject();
                    var learningObject = viewModel.learningObjects()[0];

                    learningObject.text('Some text');

                    expect(viewModel.canAddLearningObject()).toBe(true);
                });

            });

            describe('when text is empty after end editing', function () {

                it('should be true', function () {
                    viewModel.learningObjects([]);
                    viewModel.addLearningObject();

                    var learningObject = viewModel.learningObjects()[0];
                    learningObject.text('Some text');
                    learningObject.isEditing(false);
                    viewModel.saveLearningObject(learningObject);

                    learningObject.text('');
                    expect(viewModel.canAddLearningObject()).toBe(true);
                });

            });

        });

        describe('deleteLearningObject:', function () {

            it('should be a function', function () {
                expect(viewModel.deleteLearningObject).toBeFunction();
            });

            describe('when called', function () {

                var getQuestionByIdDeferred;
                var getQuestionByIdDeferredPromise;

                beforeEach(function () {
                    getQuestionByIdDeferred = Q.defer();
                    getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                    spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
                });

                it('should send event \'Delete learning object\'', function () {
                    viewModel.deleteLearningObject(viewModel.learningObjects()[0]);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete learning object');
                });

                it('should delete learning object form viewModel', function () {
                    var learningObject = {
                        text: ko.observable('Some text'),
                        isEditing: ko.observable(true),
                        id: '0'
                    };
                    viewModel.learningObjects([learningObject]);
                    viewModel.deleteLearningObject(learningObject);

                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.learningObjects().indexOf(learningObject)).toBe(-1);
                    });
                });

            });

        });

        describe('language:', function () {

            it('should be defined', function () {
                expect(viewModel.language).toBeDefined();
            });

            it('should be observable', function() {
                expect(viewModel.language).toBeObservable();
            });

        });

        describe('saveLearningObject:', function () {

            var getQuestionByIdDeferred;
            var getQuestionByIdDeferredPromise;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
            });

            it('should be a function', function () {
                expect(viewModel.saveLearningObject).toBeFunction();
            });

            describe('when called with empty text', function () {

                describe('and finished editing', function () {

                    it('should remove learning object from viewmodel', function () {
                        var learningObject = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };
                        viewModel.learningObjects([learningObject]);
                        learningObject.text(' ');
                        learningObject.isEditing(false);
                        viewModel.saveLearningObject(learningObject);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.learningObjects().indexOf(learningObject)).toBe(-1);
                        });

                    });

                    it('should remove learning object from repository', function () {
                        var learningObject = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };

                        var testQuestion = {
                            id: '1',
                            title: 'lalala',
                            answerOptions: [],
                            learningObjects: [learningObject]
                        };

                        viewModel.learningObjects([learningObject]);
                        learningObject.text(' ');
                        learningObject.isEditing(false);
                        viewModel.saveLearningObject(learningObject);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(testQuestion);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(testQuestion.learningObjects.length).toEqual(0);
                        });
                    });

                    it('should remove subscriptions from learning object', function () {
                        var learningObject = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };
                        viewModel.learningObjects([learningObject]);

                        learningObject.text(' ');
                        learningObject.isEditing(false);

                        var disposeSpy = jasmine.createSpyObj('disposeSpy', ['dispose']);
                        learningObject.editingSubscription = disposeSpy;

                        viewModel.saveLearningObject(learningObject);

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

                describe('and learning object exists in data context', function () {

                    it('should save text', function () {
                        var learningObject = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };
                        viewModel.learningObjects([learningObject]);

                        viewModel.learningObjects()[0].text('Some text');

                        viewModel.saveLearningObject(learningObject);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(question);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.learningObjects()[0].text()).toBe(learningObject.text());
                        });
                    });

                });

                describe('and learning object does not exist in data context', function () {

                    it('should create learning object and save text', function () {
                        var learningObject = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '0'
                        };

                        var testQuestion = {
                            id: '1',
                            title: 'lalala',
                            answerOptions: [],
                            learningObjects: []
                        };

                        viewModel.learningObjects([learningObject]);

                        viewModel.saveLearningObject(learningObject);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(testQuestion);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(testQuestion.learningObjects[0]).toBeDefined();
                            expect(testQuestion.learningObjects[0].text).toBe(learningObject.text());
                        });
                    });

                });

                it('should update notification', function () {
                    spyOn(notify, 'info');

                    var learningObject = {
                        text: ko.observable('Some text'),
                        isEditing: ko.observable(true),
                        id: '1'
                    };
                    viewModel.learningObjects([learningObject]);

                    learningObject.text('Some text');

                    viewModel.saveLearningObject(learningObject);

                    var promise = getQuestionByIdDeferredPromise.fin(function () { });
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(notify.info).toHaveBeenCalled();
                    });
                });

                describe('when old text != current text', function () {
                    
                    it('should not update notfication', function() {
                        spyOn(notify, 'info');

                        var learningObject = {
                            text: ko.observable('Some text'),
                            isEditing: ko.observable(true),
                            id: '2'
                        };
                        var testQuestion = {
                            id: '1',
                            title: 'lalala',
                            answerOptions: [],
                            learningObjects: [{
                                text: 'Some text',
                                isEditing: ko.observable(true),
                                id: '2'
                            }]
                        };
                        
                        viewModel.learningObjects([learningObject]);
                        
                        viewModel.saveLearningObject(learningObject);

                        var promise = getQuestionByIdDeferredPromise.fin(function () { });
                        getQuestionByIdDeferred.resolve(testQuestion);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(notify.info).wasNotCalled();
                        });
                    });
                    
                });
            });

        });

        describe('answerOptions:', function () {

            it('should be observable', function () {
                expect(viewModel.answerOptions).toBeObservable();
            });

        });

        describe('learningObjectAutosaveInterval:', function () {

            it('should be number', function () {
                expect(viewModel.learningObjectAutosaveInterval).toEqual(jasmine.any(Number));
            });

        });

        describe('eventTracker:', function () {

            it('should be object', function () {
                expect(viewModel.eventTracker).toBeObject();
            });

        });

        describe('addAnswerOption:', function () {

            var getQuestionByIdDeferred;
            var getQuestionByIdDeferredPromise;

            beforeEach(function () {
                getQuestionByIdDeferred = Q.defer();
                getQuestionByIdDeferredPromise = getQuestionByIdDeferred.promise;

                spyOn(questionRepository, 'getById').andReturn(getQuestionByIdDeferredPromise);
            });

            it('should be function', function () {
                expect(viewModel.addAnswerOption).toBeFunction();
            });

            it('should send event \'Add answer option\'', function () {
                viewModel.addAnswerOption();
                expect(eventTracker.publish).toHaveBeenCalledWith('Add answer option');
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
                    learningObjects: []
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
                    learningObjects: []
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
                        learningObjects: []
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
                spyOn(notify, 'info');
            });

            it('should be function', function () {
                expect(viewModel.toggleAnswerCorrectness).toBeFunction();
            });

            it('should send event \'Change answer option correctness\'', function () {
                viewModel.toggleAnswerCorrectness();
                expect(eventTracker.publish).toHaveBeenCalledWith('Change answer option correctness');
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
                    learningObjects: []
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
                    expect(notify.info).toHaveBeenCalled();
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
                        learningObjects: []
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
                        learningObjects: []
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
                        learningObjects: []
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
                        learningObjects: []
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
                spyOn(notify, 'info');
            });

            it('should be function', function () {
                expect(viewModel.saveAnswerOption).toBeFunction();
            });

            it('should send event \'Save the answer option text\'', function () {
                viewModel.saveAnswerOption();
                expect(eventTracker.publish).toHaveBeenCalledWith('Save the answer option text');
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
                    learningObjects: []
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
                    learningObjects: []
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
                    expect(notify.info).toHaveBeenCalled();
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
                spyOn(notify, 'info');
            });

            it('should be function', function () {
                expect(viewModel.deleteAnswerOption).toBeFunction();
            });

            it('should send event \'Delete answer option\'', function () {
                viewModel.deleteAnswerOption();
                expect(eventTracker.publish).toHaveBeenCalledWith('Delete answer option');
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
                    learningObjects: []
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
                    learningObjects: []
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
                    learningObjects: []
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
                    expect(notify.info).toHaveBeenCalled();
                });

            });
        });

    });

});
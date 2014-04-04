define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/questions/question'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        questionRepository = require('repositories/questionRepository'),
        objectiveRepository = require('repositories/objectiveRepository'),
        notify = require('notify'),
        http = require('plugins/http'),
        localizationManager = require('localization/localizationManager'),
        BackButton = require('models/backButton')
    ;

    var question = {
        id: '1',
        title: 'lalala',
        createdOn: new Date(),
        modifiedOn: new Date(),
        answerOptions: [],
        learningContents: []
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
                learningContents: []
            },
            question,
            {
                id: '2',
                title: 'Question 3',
                answerOptions: [],
                learningContents: []
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

        describe('objectiveId:', function () {
            it('should be defined', function () {
                expect(viewModel.objectiveId).toBeDefined();
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

        describe('navigateToObjectiveEvent:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToObjectiveEvent).toBeFunction();
            });

            it('should send event \'Navigate to courses\'', function () {
                viewModel.navigateToObjectiveEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective');
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

            it('should trim title', function () {
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
                    spyOn(notify, 'saved');
                    viewModel.endEditQuestionTitle();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                        expect(notify.saved).not.toHaveBeenCalled();
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
                            spyOn(notify, 'saved');

                            viewModel.endEditQuestionTitle();

                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(question);

                            waitsFor(function () {
                                return !getPromise.isPending() && !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(notify.saved).toHaveBeenCalled();
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

                spyOn(http, 'post');
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when objective not found', function () {
                beforeEach(function () {
                    getObjectiveByIdDeferred.reject('reason');
                });

                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                    router.activeItem.settings.lifecycleData = null;

                    var promise = viewModel.activate('objectiveId', 'questionId');
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                    });
                });

                it('should reject promise', function () {
                    var promise = viewModel.activate('objectiveId', 'questionId');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('reason');
                    });
                });

            });

            describe('when question not found', function () {

                beforeEach(function () {
                    getObjectiveByIdDeferred.resolve(objective);
                    getQuestionByIdDeferred.reject('reason');
                });

                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                    router.activeItem.settings.lifecycleData = null;

                    var promise = viewModel.activate('objectiveId', 'questionId');
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                    });
                });

                it('should reject promise', function () {
                    var promise = viewModel.activate('objectiveId', 'questionId');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('reason');
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
                    expect(viewModel.objectiveId).toBe(objectiveFull.id);
                    expect(viewModel.title()).toBe(question.title);
                    expect(viewModel.answers).toBeDefined();
                    expect(viewModel.learningContents).toBeDefined();
                });
            });

            var queryString;
            describe('when queryString in null', function() {

                beforeEach(function() {
                    queryString = null;
                });

                it('should configure back button that it always visible', function () {
                    spyOn(viewModel.backButtonData, 'configure');
                    spyOn(localizationManager, 'localize').and.returnValue('text');

                    var promise = viewModel.activate(objective.id, question.id, queryString);

                    getObjectiveByIdDeferred.resolve(objectiveFull);
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.backButtonData.configure).toHaveBeenCalledWith({ backViewName: '\'' + objectiveFull.title + '\'', url: 'objective/' + objectiveFull.id, callback: viewModel.navigateToObjectiveEvent, alwaysVisible: true });
                    });
                });

            });

            describe('when queryString in not null', function() {

                beforeEach(function() {
                    queryString = {};
                });

                it('should configure back button that it not always visible', function () {
                    spyOn(viewModel.backButtonData, 'configure');
                    spyOn(localizationManager, 'localize').and.returnValue('text');

                    var promise = viewModel.activate(objective.id, question.id, queryString);

                    getObjectiveByIdDeferred.resolve(objectiveFull);
                    getQuestionByIdDeferred.resolve(question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.backButtonData.configure).toHaveBeenCalledWith({ backViewName: '\'' + objectiveFull.title + '\'', url: 'objective/' + objectiveFull.id, callback: viewModel.navigateToObjectiveEvent, alwaysVisible: false });
                    });
                });

            });

        });

        describe('language:', function () {

            it('should be observable', function () {
                expect(viewModel.language).toBeObservable();
            });

        });

        describe('eventTracker:', function () {

            it('should be object', function () {
                expect(viewModel.eventTracker).toBeObject();
            });

        });

        describe('localizationManager', function () {

            it('should be defined', function () {
                expect(viewModel.localizationManager).toBeDefined();
            });

        });

        describe('isCreatedQuestion:', function () {

            it('should be observable', function () {
                expect(viewModel.isCreatedQuestion).toBeObservable();
            });

        });

        describe('questionContent:', function () {

            it('should be object', function () {
                expect(viewModel.questionContent).toBeObject();
            });

        });

        describe('backButtonData:', function () {

            it('should be instance of BackButton', function () {
                expect(viewModel.backButtonData).toBeInstanceOf(BackButton);
            });

        });

    });

});
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

            it('should send event \'Navigate to objective details\'', function () {
                viewModel.navigateToObjectiveEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
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

                spyOn(questionRepository, 'updateTitle').and.returnValue(updateDeferred.promise);
                spyOn(questionRepository, 'getById').and.returnValue(getByIdDeferred.promise);
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

                it('should not send event', function (done) {
                    viewModel.endEditQuestionTitle();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        expect(eventTracker.publish).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should not show notification', function (done) {
                    spyOn(notify, 'saved');
                    viewModel.endEditQuestionTitle();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        expect(notify.saved).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should not update question in repository', function (done) {
                    viewModel.endEditQuestionTitle();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        expect(questionRepository.updateTitle).not.toHaveBeenCalled();
                        done();
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

                it('should send event \'Update question title\'', function (done) {
                    viewModel.endEditQuestionTitle();

                    getPromise.fin(function () {
                        expect(getPromise).toBeResolved();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update question title');
                        done();
                    });
                });

                describe('and when title is valid', function () {

                    it('should update question in repository', function (done) {
                        viewModel.endEditQuestionTitle();

                        getPromise.fin(function () {
                            expect(getPromise).toBeResolved();
                            expect(questionRepository.updateTitle).toHaveBeenCalled();
                            expect(questionRepository.updateTitle.calls.mostRecent().args[1]).toEqual(newTitle);
                            done();
                        });
                    });

                    describe('and when question updated successfully', function () {

                        it('should update notificaion', function (done) {
                            spyOn(notify, 'saved');

                            viewModel.endEditQuestionTitle();

                            var promise = updateDeferred.promise.finally(function () { });
                            updateDeferred.resolve(question);

                            Q.all(getPromise, promise).fin(function () {
                                expect(promise).toBeResolved();
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

                describe('and when title is not valid', function () {

                    it('should revert quiestion title value', function (done) {
                        viewModel.title('');
                        viewModel.endEditQuestionTitle();

                        getPromise.fin(function () {
                            expect(viewModel.title()).toBe(question.title);
                            done();
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

                spyOn(questionRepository, 'getById').and.returnValue(getQuestionByIdDeferred.promise);
                spyOn(objectiveRepository, 'getById').and.returnValue(getObjectiveByIdDeferred.promise);

                spyOn(http, 'post');
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when objective not found', function () {
                beforeEach(function () {
                    getObjectiveByIdDeferred.reject('reason');
                });

                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                    router.activeItem.settings.lifecycleData = null;

                    viewModel.activate('objectiveId', 'questionId').fin(function () {
                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        done();
                    });
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.activate('objectiveId', 'questionId');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('reason');
                        done();
                    });
                });

            });

            describe('when question not found', function () {

                beforeEach(function () {
                    getObjectiveByIdDeferred.resolve(objective);
                    getQuestionByIdDeferred.reject('reason');
                });

                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                    router.activeItem.settings.lifecycleData = null;

                    viewModel.activate('objectiveId', 'questionId').fin(function () {
                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        done();
                    });
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.activate('objectiveId', 'questionId');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('reason');
                        done();
                    });
                });

            });

            it('should initialize fields', function (done) {
                getObjectiveByIdDeferred.resolve(objectiveFull);
                getQuestionByIdDeferred.resolve(question);

                var promise = viewModel.activate(objective.id, question.id);

                promise.fin(function () {
                    expect(viewModel.objectiveId).toBe(objectiveFull.id);
                    expect(viewModel.title()).toBe(question.title);
                    expect(viewModel.answers).toBeDefined();
                    expect(viewModel.learningContents).toBeDefined();
                    done();
                });
            });

            var queryString;
            describe('when queryString in null', function() {

                beforeEach(function() {
                    queryString = null;
                });

                it('should configure back button that it always visible', function (done) {
                    spyOn(viewModel.backButtonData, 'configure');
                    spyOn(localizationManager, 'localize').and.returnValue('text');
                    getObjectiveByIdDeferred.resolve(objectiveFull);
                    getQuestionByIdDeferred.resolve(question);

                    var promise = viewModel.activate(objective.id, question.id, queryString);

                    promise.fin(function () {
                        expect(viewModel.backButtonData.configure).toHaveBeenCalledWith({ backViewName: '\'' + objectiveFull.title + '\'', url: 'objective/' + objectiveFull.id, callback: viewModel.navigateToObjectiveEvent, alwaysVisible: true });
                        done();
                    });
                });

            });

            describe('when queryString contains courseId', function() {

                beforeEach(function() {
                    queryString = {
                        courseId: 'courseId'
                };
                });

                it('should configure back button that it not always visible', function (done) {
                    spyOn(viewModel.backButtonData, 'configure');
                    spyOn(localizationManager, 'localize').and.returnValue('text');
                    getObjectiveByIdDeferred.resolve(objectiveFull);
                    getQuestionByIdDeferred.resolve(question);

                    viewModel.activate(objective.id, question.id, queryString).fin(function () {
                        expect(viewModel.backButtonData.configure).toHaveBeenCalledWith({ backViewName: '\'' + objectiveFull.title + '\'', url: 'objective/' + objectiveFull.id, callback: viewModel.navigateToObjectiveEvent, alwaysVisible: false });
                        done();
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
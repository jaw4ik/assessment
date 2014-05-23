define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/questions/question'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        questionRepository = require('repositories/questionRepository'),
        objectiveRepository = require('repositories/objectiveRepository'),
        http = require('plugins/http'),
        localizationManager = require('localization/localizationManager'),
        ping = require('ping'),
        BackButton = require('models/backButton');

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

        describe('navigateToObjectiveEvent:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToObjectiveEvent).toBeFunction();
            });

            it('should send event \'Navigate to objective details\'', function () {
                viewModel.navigateToObjectiveEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
            });

        });

        describe('canActivate:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(ping, 'execute').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.canActivate()).toBePromise();
            });

            it('should ping', function () {
                viewModel.canActivate();
                expect(ping.execute).toHaveBeenCalled();
            });

            describe('when ping failed', function () {

                beforeEach(function () {
                    dfd.reject();
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.canActivate();
                    promise.fin(function () {
                        expect(promise).toBeRejected();
                        done();
                    });
                });

            });

            describe('when ping succeed', function () {

                beforeEach(function () {
                    dfd.resolve();
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.canActivate();
                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
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
                    done();
                });
            });

            var queryString;
            describe('when queryString in null', function () {

                beforeEach(function () {
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

            describe('when queryString contains courseId', function () {

                beforeEach(function () {
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

        describe('backButtonData:', function () {

            it('should be instance of BackButton', function () {
                expect(viewModel.backButtonData).toBeInstanceOf(BackButton);
            });

        });

    });

});
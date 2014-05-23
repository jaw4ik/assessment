define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/questions/multipleChoice/multipleChoice'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        constants = require('constants'),
        answerRepository = require('repositories/answerRepository'),
        learningContentRepository = require('repositories/learningContentRepository'),
        http = require('plugins/http'),
        BackButton = require('models/backButton');

    var objectiveId = 'objectiveId';

    var question = {
        id: '1',
        title: 'lalala',
        content: 'ololosh',
        createdOn: new Date(),
        modifiedOn: new Date(),
        answerOptions: [],
        learningContents: []
    };

    describe('question [multipleChoice]', function () {

        beforeEach(function() {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'navigateWithQueryString');
            spyOn(router, 'replace');
        });

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
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

        describe('backButtonData:', function() {

            it('should be instance of BackButton', function() {
                expect(viewModel.backButtonData).toBeInstanceOf(BackButton);
            });

        });

        describe('questionTitleMaxLength:', function () {

            it('should be equal constants.validation.questionTitleMaxLength', function () {
                expect(viewModel.questionTitleMaxLength).toBe(constants.validation.questionTitleMaxLength);
            });

        });

        describe('initialize:', function () {
            var getAnswerCollectionDefer;
            var getLCCollectionDefer;

            beforeEach(function () {
                getAnswerCollectionDefer = Q.defer();
                getLCCollectionDefer = Q.defer();
                spyOn(answerRepository, 'getCollection').and.returnValue(getAnswerCollectionDefer.promise);
                spyOn(learningContentRepository, 'getCollection').and.returnValue(getLCCollectionDefer.promise);

                spyOn(http, 'post');
            });

            it('should return promise', function() {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            it('should initialize field', function() {
                viewModel.initialize(objectiveId, question);
                expect(viewModel.objectiveId).toBe(objectiveId);
                expect(viewModel.title.title()).toBe(question.title);
                expect(viewModel.questionContent.text()).toBe(question.content);
            });

            it('should initialize fields', function (done) {
                getAnswerCollectionDefer.resolve();
                getLCCollectionDefer.resolve();

                var promise = viewModel.initialize(objectiveId, question);
                promise.fin(function () {
                    expect(viewModel.answers).toBeDefined();
                    expect(viewModel.learningContents).toBeDefined();
                    done();
                });
            });

        });

    });

});
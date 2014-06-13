define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/questions/multipleSelect/multipleSelect'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        constants = require('constants'),
        answerRepository = require('repositories/answerRepository'),
        learningContentRepository = require('repositories/learningContentRepository'),
        http = require('plugins/http'),
        app = require('durandal/app'),
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

    describe('question [multipleSelect]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'navigateWithQueryString');
            spyOn(router, 'replace');
        });

        it('should be defined', function () {
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

        describe('backButtonData:', function () {

            it('should be instance of BackButton', function () {
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

            it('should return promise', function () {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            it('should initialize field', function () {
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

        describe('contentUpdated:', function () {
            var vmContent = { text: ko.observable(''), isEditing:ko.observable(false) };

            beforeEach(function() {
                viewModel.questionContent = vmContent;
                viewModel.questionId = question.id;
            });

            it('should be function', function () {
                expect(viewModel.contentUpdated).toBeFunction();
            });

            describe('when is not current question', function () {
                it('should not update content', function () {
                    viewModel.questionId = 'qqq';
                    vmContent.text('');
                    viewModel.contentUpdated(question);
                    expect(vmContent.text()).toBe('');
                });
            });

            describe('when is editing content', function () {
                it('should not update content', function () {
                    vmContent.text('');
                    vmContent.isEditing(true);
                    viewModel.contentUpdated(question);
                    expect(vmContent.text()).toBe('');
                });
            });

            it('should update content', function() {
                vmContent.text('');
                vmContent.isEditing(false);
                viewModel.contentUpdated(question);
                expect(vmContent.text()).toBe(question.content);
            });

            describe('isExpanded:', function () {

                it('should be observable', function () {
                    expect(viewModel.isExpanded).toBeObservable();
                });

                it('should be true by default', function () {
                    expect(viewModel.isExpanded()).toBeTruthy();
                });

            });

            describe('toggleExpand:', function () {

                it('should be function', function () {
                    expect(viewModel.toggleExpand).toBeFunction();
                });

                it('should toggle isExpanded value', function () {
                    viewModel.isExpanded(false);
                    viewModel.toggleExpand();
                    expect(viewModel.isExpanded()).toEqual(true);
                });

            });

        });

    });

});
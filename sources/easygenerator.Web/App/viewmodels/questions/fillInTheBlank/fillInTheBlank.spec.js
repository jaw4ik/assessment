﻿define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/questions/fillInTheBlank/fillInTheBlank'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        answerRepository = require('repositories/answerRepository'),
        constants = require('constants'),
        http = require('plugins/http'),
        learningContentRepository = require('repositories/learningContentRepository'),
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

    describe('question [fillInTheBlank]', function () {
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
                expect(viewModel.questionId).toBe(question.id);
                expect(viewModel.title.title()).toBe(question.title);
            });

            it('should initialize fields', function (done) {
                getAnswerCollectionDefer.resolve();
                getLCCollectionDefer.resolve();

                var promise = viewModel.initialize(objectiveId, question);
                promise.fin(function () {
                    expect(viewModel.fillInTheBlank).toBeDefined();
                    expect(viewModel.learningContents).toBeDefined();
                    expect(viewModel.fillInTheBlank.text()).toBe(question.content);
                    done();
                });
            });

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

        describe('questionId:', function() {
            it('should be defined', function() {
                expect(viewModel.questionId).toBeDefined();
            });    
        });

        describe('updatedByCollaborator:', function () {
            beforeEach(function() {
                spyOn(viewModel.fillInTheBlank, 'updatedByCollaborator');
            });

            it('should be function', function () {
                expect(viewModel.updatedByCollaborator).toBeFunction();
            });

            it('should update fillInTheBlank', function () {
                viewModel.questionId = question.id;
                viewModel.updatedByCollaborator(question);
                expect(viewModel.fillInTheBlank.updatedByCollaborator).toHaveBeenCalled();
            });

            describe('when question is not current', function() {
                it('should not update fillInTheBlank', function() {
                    viewModel.questionId = 'someId';
                    viewModel.updatedByCollaborator(question);
                    expect(viewModel.fillInTheBlank.updatedByCollaborator).not.toHaveBeenCalled();
                });
            });
        });
    });

});
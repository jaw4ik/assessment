import viewModel from './fillInTheBlank';

import router from 'routing/router';
import eventTracker from 'eventTracker';
import questionRepository from 'repositories/questionRepository';
import http from 'plugins/http';
import localizationManager from 'localization/localizationManager';

var sectionId = 'sectionId',
    question = {
        id: '1',
        title: 'lalala',
        content: 'ololosh',
        createdOn: new Date(),
        modifiedOn: new Date(),
        answerOptions: [],
        learningContents: []
    },
    questionData = {};

describe('question [fillInTheBlank]', function () {
    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(router, 'navigateWithQueryString');
        spyOn(router, 'replace');
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg;
        });
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

    describe('initialize:', function () {
        var getFillInTheBlankDefer;

        beforeEach(function () {
            getFillInTheBlankDefer = Q.defer();
            spyOn(questionRepository, 'getFillInTheBlank').and.returnValue(getFillInTheBlankDefer.promise);
            spyOn(http, 'post');
        });

        it('should return promise', function () {
            var promise = viewModel.initialize(sectionId, question);
            expect(promise).toBePromise();
        });

        it('should set sectionId', function () {
            viewModel.initialize(sectionId, question);

            expect(viewModel.sectionId).toBe(sectionId);
        });

        it('should set questionId', function () {
            viewModel.initialize(sectionId, question);

            expect(viewModel.questionId).toBe(question.id);
        });

        it('should get FillInBlanks data', function() {
            viewModel.initialize(sectionId, question);

            expect(questionRepository.getFillInTheBlank).toHaveBeenCalledWith(question.id);
        });

        describe('when FillInBlanks data is taken', function () {
            beforeEach(function() {
                getFillInTheBlankDefer.resolve(questionData);
            });

            it('should initialize fillInTheBlank', function (done) {
                viewModel.fillInTheBlank = null;

                var promise = viewModel.initialize(sectionId, question);

                promise.fin(function () {
                    expect(viewModel.fillInTheBlank).toBeDefined();
                    done();
                });
            });

            it('should return object', function (done) {
                var promise = viewModel.initialize(sectionId, question);
                promise.then(function (result) {
                    expect(result).toBeObject();
                    done();
                });
            });

            describe('and result object', function () {
                it('should contain \'fillInTheBlanksEditor\' viewCaption', function (done) {
                    var promise = viewModel.initialize(sectionId, question);
                    promise.then(function (result) {
                        expect(result.viewCaption).toBe('fillInTheBlanksEditor');
                        done();
                    });
                });

                it('should have hasQuestionView property with true value', function (done) {
                    var promise = viewModel.initialize(sectionId, question);
                    promise.then(function (result) {
                        expect(result.hasQuestionView).toBeTruthy();
                        done();
                    });
                });

                it('should have hasFeedback property with true value', function (done) {
                    var promise = viewModel.initialize(sectionId, question);
                    promise.then(function (result) {
                        expect(result.hasFeedback).toBeTruthy();
                        done();
                    });
                });
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

    describe('questionId:', function () {
        it('should be defined', function () {
            expect(viewModel.questionId).toBeDefined();
        });
    });

    describe('updatedByCollaborator:', function () {
        beforeEach(function () {
            viewModel.fillInTheBlank = { updatedByCollaborator: function () { } };
            spyOn(viewModel.fillInTheBlank, 'updatedByCollaborator');
        });

        it('should be function', function () {
            expect(viewModel.updatedByCollaborator).toBeFunction();
        });

        it('should update fillInTheBlank', function () {
            viewModel.questionId = question.id;
            viewModel.updatedByCollaborator(question.id, {});
            expect(viewModel.fillInTheBlank.updatedByCollaborator).toHaveBeenCalled();
        });

        describe('when question is not current', function () {
            it('should not update fillInTheBlank', function () {
                viewModel.questionId = 'someId';
                viewModel.updatedByCollaborator(question.id, {});
                expect(viewModel.fillInTheBlank.updatedByCollaborator).not.toHaveBeenCalled();
            });
        });
    });
});

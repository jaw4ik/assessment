import viewModel from './multipleSelect';

import router from 'routing/router';
import eventTracker from 'eventTracker';
import answerRepository from 'repositories/answerRepository';
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

    describe('initialize:', function () {
        var getAnswerCollectionDefer;

        beforeEach(function () {
            getAnswerCollectionDefer = Q.defer();
            spyOn(answerRepository, 'getCollection').and.returnValue(getAnswerCollectionDefer.promise);
            spyOn(http, 'post');
            spyOn(localizationManager, 'localize').and.callFake(function (arg) {
                return arg;
            });
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

        it('should get answers', function () {
            viewModel.initialize(sectionId, question);

            expect(answerRepository.getCollection).toHaveBeenCalledWith(question.id);
        });

        describe('when answers are recived', function () {
            var answers = [];

            beforeEach(function () {
                getAnswerCollectionDefer.resolve(answers);
            });

            it('should set answers', function () {
                viewModel.answers = null;

                viewModel.initialize(sectionId, question);

                expect(viewModel.answers).toBeDefined();
            });

            it('should return object', function (done) {
                var promise = viewModel.initialize(sectionId, question);
                promise.then(function (result) {
                    expect(result).toBeObject();
                    done();
                });
            });

            describe('and result object', function () {
                it('should contain \'multipleSelectEditor\' viewCaption', function (done) {
                    var promise = viewModel.initialize(sectionId, question);
                    promise.then(function (result) {
                        expect(result.viewCaption).toBe('multipleSelectEditor');
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

                it('should have hasQuestionContent property with true value', function (done) {
                    var promise = viewModel.initialize(sectionId, question);
                    promise.then(function (result) {
                        expect(result.hasQuestionContent).toBeTruthy();
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

});

import viewModel from './singleSelectImage';

import localizationManager from 'localization/localizationManager';

describe('question [singleSelectImage]', function () {

    it('should be defined', function () {
        expect(viewModel).toBeDefined();
    });


    describe('initialize:', function () {
        var sectionId = 'sectionId';
        var question = { id: 'questionId' };
        var dfd;

        beforeEach(function () {
            dfd = Q.defer();
            spyOn(viewModel.singleSelectImage, 'activate').and.returnValue(dfd.promise);
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

        it('should activate designer', function () {
            viewModel.initialize(sectionId, question);

            expect(viewModel.singleSelectImage.activate).toHaveBeenCalledWith(question.id);
        });

        describe('when designer is activated', function () {
            beforeEach(function () {
                dfd.resolve();
            });

            it('should return object', function (done) {
                var promise = viewModel.initialize(sectionId, question);
                promise.then(function (result) {
                    expect(result).toBeObject();
                    done();
                });
            });

            describe('and result object', function () {

                it('should contain \'singleSelectImageEditor\' viewCaption', function (done) {
                    var promise = viewModel.initialize(sectionId, question);
                    promise.then(function (result) {
                        expect(result.viewCaption).toBe('singleSelectImageEditor');
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

    describe('singleSelectImage:', function () {
        it('should be defined', function () {
            expect(viewModel.singleSelectImage).toBeDefined();
        });
    });
});

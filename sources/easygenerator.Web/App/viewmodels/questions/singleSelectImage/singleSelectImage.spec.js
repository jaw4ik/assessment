define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/questions/singleSelectImage/singleSelectImage');


    describe('question [singleSelectImage]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });


        describe('initialize:', function () {
            var objectiveId = 'objectiveId';
            var question = { id: 'questionId' };
            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(viewModel.singleSelectImage, 'activate').and.returnValue(dfd.promise);
            });

            it('should return promise', function () {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            describe('when designer is activated', function () {
                beforeEach(function (done) {
                    dfd.resolve();
                    done();
                });

                it('should initialize fields', function (done) {
                    viewModel.initialize(objectiveId, question);
                    dfd.promise.then(function () {
                        expect(viewModel.objectiveId).toBe(objectiveId);
                        expect(viewModel.questionId).toBe(question.id);
                        done();
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
});
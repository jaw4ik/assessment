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

            it('should return promise', function () {
                var promise = viewModel.initialize(objectiveId, question);
                expect(promise).toBePromise();
            });

            it('should initialize field', function () {
                viewModel.initialize(objectiveId, question);
                expect(viewModel.objectiveId).toBe(objectiveId);
                expect(viewModel.questionId).toBe(question.id);
            });

        });
    });
});
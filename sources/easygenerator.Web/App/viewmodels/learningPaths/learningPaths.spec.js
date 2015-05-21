define(['viewmodels/learningPaths/learningPaths'], function (viewModel) {
    "use strict";
    var
         createLearningPathCommand = require('viewmodels/learningPaths/commands/createLearningPathCommand'),
         getLearningPathCollectionQuery = require('viewmodels/learningPaths/queries/getLearningPathCollectionQuery')
    ;

    describe('viewModel [learningPaths]', function () {
        describe('activate:', function () {
            var defer,
                learningPaths = [
                {
                    id: '0',
                    createdOn: new Date(1)
                },
                {
                    id: '0',
                    createdOn: new Date(1)
                }
                ];

            beforeEach(function () {
                defer = Q.defer();
                spyOn(getLearningPathCollectionQuery, 'execute').and.returnValue(defer.promise);
            });

            describe('when learning paths retrieved', function () {
                beforeEach(function () {
                    defer.resolve(learningPaths);
                });

                it('should set learning paths ordered by created on', function (done) {
                    viewModel.learningPaths([]);
                    viewModel.activate().fin(function () {
                        expect(viewModel.learningPaths().length).toBe(learningPaths.length);
                        expect(viewModel.learningPaths()[0].createdOn.toLocaleString()).toBe(learningPaths[1].createdOn.toLocaleString());
                        expect(viewModel.learningPaths()[1].createdOn.toLocaleString()).toBe(learningPaths[0].createdOn.toLocaleString());
                        done();
                    });
                });
            });
        });

        describe('createLearningPath:', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(createLearningPathCommand, 'execute').and.returnValue(defer.promise);
            });

            it('should execute create learning path command', function () {
                viewModel.createLearningPath();
                expect(createLearningPathCommand.execute).toHaveBeenCalled();
            });

            it('should return create learning path command result', function () {
                var result = viewModel.createLearningPath();
                expect(result).toBe(defer.promise);
            });
        });

        describe('activate:', function () {

        });
    });
});
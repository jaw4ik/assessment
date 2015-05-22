define(['viewmodels/learningPaths/learningPath'], function (viewModel) {
    "use strict";
    var
         getLearningPathByIdQuery = require('viewmodels/learningPaths/queries/getLearningPathByIdQuery'),
         router = require('plugins/router')
    ;

    describe('viewModel [learningPath]', function () {
        var learningPath = {
            id: 'id',
            title: 'title'
        },
            getLearnigPathDefer;

        beforeEach(function () {
            getLearnigPathDefer = Q.defer();
            spyOn(router, 'navigate');
            spyOn(getLearningPathByIdQuery, 'execute').and.returnValue(getLearnigPathDefer.promise);
        });

        describe('canActivate:', function () {
            describe('when learning path is not found', function () {
                beforeEach(function () {
                    getLearnigPathDefer.resolve(undefined);
                });

                it('should return redirect object', function (done) {
                    viewModel.canActivate(learningPath.id).then(function (data) {
                        expect(data).toBeObject();
                        done();
                    });
                });
            });

            describe('when learning path is found', function () {
                beforeEach(function () {
                    getLearnigPathDefer.resolve(learningPath);
                });

                it('should return true', function (done) {
                    viewModel.canActivate(learningPath.id).then(function (data) {
                        expect(data).toBeTruthy();
                        done();
                    });
                });
            });
        });

        describe('activate:', function () {
            it('should set learning path id', function () {
                viewModel.learningPathId = null;
                viewModel.activate(learningPath.id);
                expect(viewModel.learningPathId).toBe(learningPath.id);
            });

            describe('when received learning path', function () {
                beforeEach(function () {
                    getLearnigPathDefer.resolve(learningPath);
                });

                it('should set title', function (done) {
                    viewModel.activate(learningPath.id).fin(function () {
                        expect(viewModel.title()).toBe(learningPath.title);
                        done();
                    });
                });
            });
        });

        describe('back:', function () {
            it('should navigate to learning paths', function () {
                viewModel.back();
                expect(router.navigate).toHaveBeenCalledWith('#learningpaths');
            });
        });

        describe('learningPathId:', function () {
            it('should be defined', function () {
                expect(viewModel.learningPathId).toBeDefined();
            });
        });

        describe('title:', function () {
            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });
        });
    });

});
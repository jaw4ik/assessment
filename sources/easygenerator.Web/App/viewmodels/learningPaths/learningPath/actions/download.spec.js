define(['viewmodels/learningPaths/learningPath/actions/download'], function (downloadAction) {
    "use strict";

    var viewModel,
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        fileHelper = require('fileHelper')
    ;

    describe('viewModel [download]', function () {

        beforeEach(function () {
            viewModel = downloadAction();
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'error');
            spyOn(fileHelper, 'downloadFile');
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('isPublishing:', function () {

            it('should be observable', function () {
                expect(viewModel.isPublishing).toBeObservable();
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set learningPath', function () {
                viewModel.learningPath = null;
                viewModel.activate({});
                expect(viewModel.learningPath).toBeDefined();
            });

            it('should set isPublishing', function () {
                viewModel.isPublishing(false);
                viewModel.activate({ isDelivering: true });
                expect(viewModel.isPublishing()).toBeTruthy();
            });

        });

        describe('download:', function () {
            var buildDefer;

            beforeEach(function () {
                buildDefer = Q.defer();
                viewModel.isPublishing(false);
                viewModel.learningPath = { build: function () { } };
                spyOn(viewModel.learningPath, 'build').and.returnValue(buildDefer.promise);
            });

            it('should be function', function () {
                expect(viewModel.download).toBeFunction();
            });

            describe('when isPublishing is true', function () {

                beforeEach(function () {
                    viewModel.isPublishing(true);
                });

                it('should not build learningPath again', function () {
                    viewModel.download();
                    expect(viewModel.learningPath.build).not.toHaveBeenCalled();
                });

            });

            it('should set isPublishing in true', function () {
                viewModel.download();
                expect(viewModel.isPublishing()).toBeTruthy();
            });

            it('should publish \'Download learning path (HTML)\' event', function () {
                viewModel.download();
                expect(eventTracker.publish).toHaveBeenCalledWith('Download learning path (HTML)');
            });

            it('should build learningPath', function () {
                viewModel.download();
                expect(viewModel.learningPath.build).toHaveBeenCalled();
            });

            describe('when build failed', function () {
                beforeEach(function () {
                    buildDefer.reject('error message');
                });

                it('notify error message', function (done) {
                    viewModel.download().fin(function () {
                        expect(notify.error).toHaveBeenCalledWith('error message');
                        done();
                    });
                });

                it('should set isPublishing in false', function (done) {
                    viewModel.download().fin(function () {
                        expect(viewModel.isPublishing()).toBeFalsy();
                        done();
                    });
                });

            });

            describe('when build success', function () {

                beforeEach(function () {
                    buildDefer.resolve('packageUrl');
                });

                it('should download package', function (done) {
                    viewModel.download().fin(function () {
                        expect(fileHelper.downloadFile).toHaveBeenCalledWith('download/packageUrl');
                        done();
                    });
                });

                it('should set isPublishing in false', function (done) {
                    viewModel.download().fin(function () {
                        expect(viewModel.isPublishing()).toBeFalsy();
                        done();
                    });
                });

            });

        });

    });
});
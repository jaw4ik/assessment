define(['viewmodels/learningPaths/learningPath/actions/download'], function (downloadAction) {
    "use strict";

    var viewModel,
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        fileHelper = require('fileHelper'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('viewModel [learningPath download action]', function () {

        beforeEach(function () {
            viewModel = downloadAction();
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'error');
            spyOn(fileHelper, 'downloadFile');
            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('isBuilding:', function () {

            it('should be observable', function () {
                expect(viewModel.isBuilding).toBeObservable();
            });

        });

        describe('isDelivering:', function () {

            it('should be observable', function () {
                expect(viewModel.isDelivering).toBeObservable();
            });

        });

        describe('activate:', function () {
            var learningPath;
            beforeEach(function () {
                learningPath = {
                    id: 'learningPathId',
                    isBuilding: false,
                    isDelivering: function () { return false; }
                };
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set learningPath', function () {
                viewModel.learningPath = null;
                viewModel.activate(learningPath);
                expect(viewModel.learningPath).toBe(learningPath);
            });

            it('should set isBuilding', function () {
                viewModel.isBuilding(null);
                viewModel.activate(learningPath);
                expect(viewModel.isBuilding()).toBe(learningPath.isBuilding);
            });

            it('should set isDelivering', function () {
                viewModel.isDelivering(null);
                viewModel.activate(learningPath);
                expect(viewModel.isDelivering()).toBe(learningPath.isDelivering());
            });

            it('should on learning path delivering started event', function () {
                viewModel.activate(learningPath);
                expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.delivering.started + learningPath.id, viewModel.onDeliveringStarted);
            });

            it('should on learning path delivering finished event', function () {
                viewModel.activate(learningPath);
                expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPath.id, viewModel.onDeliveringFinished);
            });

        });

        describe('deactivate:', function () {
            var learningPath = { id: 'learningPathId' };

            beforeEach(function () {
                viewModel.learningPath = learningPath;
            });

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should off learning path delivering started event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.delivering.started + learningPath.id, viewModel.onDeliveringStarted);
            });

            it('should off learning path delivering finished event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPath.id, viewModel.onDeliveringFinished);
            });

        });

        describe('download:', function () {
            var buildDefer;

            beforeEach(function () {
                buildDefer = Q.defer();
                viewModel.isBuilding(false);
                viewModel.isDelivering(false);
                viewModel.learningPath = { build: function () { } };
                spyOn(viewModel.learningPath, 'build').and.returnValue(buildDefer.promise);
            });

            it('should be function', function () {
                expect(viewModel.download).toBeFunction();
            });

            describe('when isBuilding is true', function () {

                beforeEach(function () {
                    viewModel.isBuilding(true);
                });

                it('should not build learningPath again', function () {
                    viewModel.download();
                    expect(viewModel.learningPath.build).not.toHaveBeenCalled();
                });

            });

            describe('when isDelivering is true', function () {

                beforeEach(function () {
                    viewModel.isDelivering(true);
                });

                it('should not build learningPath again', function () {
                    viewModel.download();
                    expect(viewModel.learningPath.build).not.toHaveBeenCalled();
                });

            });

            it('should set isBuilding in true', function () {
                viewModel.download();
                expect(viewModel.isBuilding()).toBeTruthy();
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

                it('should set isBuilding in false', function (done) {
                    viewModel.download().fin(function () {
                        expect(viewModel.isBuilding()).toBeFalsy();
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

                it('should set isBuilding in false', function (done) {
                    viewModel.download().fin(function () {
                        expect(viewModel.isBuilding()).toBeFalsy();
                        done();
                    });
                });

            });

        });

        describe('onDeliveringStarted:', function () {

            beforeEach(function () {
                viewModel.learningPath = { id: 'learningPathId' };
            });

            it('should be function', function () {
                expect(viewModel.onDeliveringStarted).toBeFunction();
            });

            it('should set isDelivering true', function () {
                viewModel.isDelivering(false);
                viewModel.onDeliveringStarted({ id: 'learningPathId' });
                expect(viewModel.isDelivering()).toBeTruthy();
            });
        });

        describe('onDeliveringFinished:', function () {

            beforeEach(function () {
                viewModel.learningPath = { id: 'learningPathId' };
            });

            it('should be function', function () {
                expect(viewModel.onDeliveringFinished).toBeFunction();
            });

            it('should set isDelivering false', function () {
                viewModel.isDelivering(true);
                viewModel.onDeliveringFinished({ id: 'learningPathId' });
                expect(viewModel.isDelivering()).toBeFalsy();
            });
        });

    });
});
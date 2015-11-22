define(['viewmodels/learningPaths/learningPath/actions/publishToCustomLms'], function (publishAction) {
    'use strict';
    var
        viewModel,
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        constants = require('constants'),
        app = require('durandal/app');

    describe('viewModel [learningPath publish to custom LMS action]', function () {

        beforeEach(function () {
            viewModel = publishAction();
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'error');
            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        describe('learningPath:', function () {
            it('should be defined', function () {
                expect(viewModel.learningPath).toBeDefined();
            });
        });

        describe('isPublishing:', function () {
            it('should be observable', function () {
                expect(viewModel.isPublishing).toBeObservable();
            });
        });

        describe('isDelivering:', function () {
            it('should be observable', function () {
                expect(viewModel.isDelivering).toBeObservable();
            });
        });

        describe('publishAvailable:', function () {
            it('should be observable', function () {
                expect(viewModel.publishAvailable).toBeObservable();
            });
        });

        describe('publish:', function () {
            var publishDefer;

            beforeEach(function () {
                publishDefer = Q.defer();
                viewModel.isPublishing(false);
                viewModel.isDelivering(false);
                viewModel.learningPath = { publishToCustomLms: function () { } };
                spyOn(viewModel.learningPath, 'publishToCustomLms').and.returnValue(publishDefer.promise);
            });

            it('should be function', function () {
                expect(viewModel.publish).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.publish()).toBePromise();
            });

            describe('when isPublishing is true', function () {

                beforeEach(function () {
                    viewModel.isPublishing(true);
                });

                it('should not publish learningPath again', function () {
                    viewModel.publish();
                    expect(viewModel.learningPath.publishToCustomLms).not.toHaveBeenCalled();
                });

            });

            describe('when isDelivering is true', function () {

                beforeEach(function () {
                    viewModel.isDelivering(true);
                });

                it('should not publish learningPath again', function () {
                    viewModel.publish();
                    expect(viewModel.learningPath.publishToCustomLms).not.toHaveBeenCalled();
                });

            });

            it('should set isPublishing in true', function () {
                viewModel.publish();
                expect(viewModel.isPublishing()).toBeTruthy();
            });

            it('should publish \'Publish learning path to custom hosting\' event', function () {
                viewModel.publish();
                expect(eventTracker.publish).toHaveBeenCalledWith('Publish learning path to custom hosting');
            });

            it('should publish learningPath to custom LMS', function () {
                viewModel.publish();
                expect(viewModel.learningPath.publishToCustomLms).toHaveBeenCalled();
            });

            describe('when publish failed', function () {
                beforeEach(function () {
                    publishDefer.reject('error message');
                });

                it('notify error message', function (done) {
                    viewModel.publish().fin(function () {
                        expect(notify.error).toHaveBeenCalledWith('error message');
                        done();
                    });
                });

                it('should set isBuilding in false', function (done) {
                    viewModel.publish().fin(function () {
                        expect(viewModel.isPublishing()).toBeFalsy();
                        done();
                    });
                });

            });

            describe('when publish success', function () {

                beforeEach(function () {
                    publishDefer.resolve();
                });

                it('should update isPublished', function(done) {
                    viewModel.isPublished(false);

                    viewModel.publish().fin(function () {
                        expect(viewModel.isPublished()).toBeTruthy();
                        done();
                    });
                });

                it('should set isPublishing false', function (done) {
                    viewModel.publish().fin(function () {
                        expect(viewModel.isPublishing()).toBeFalsy();
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

            it('should update publishing state', function () {
                viewModel.isPublishing(false);
                viewModel.onDeliveringStarted({ id: 'learningPathId', isPublishing: true });
                expect(viewModel.isPublishing()).toBeTruthy();
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

            it('should update publishing state', function () {
                viewModel.isPublishing(true);
                viewModel.onDeliveringFinished({ id: 'learningPathId', isPublishing: false });
                expect(viewModel.isPublishing()).toBeFalsy();
            });

            it('should update publication url', function () {
                viewModel.publicationUrl('');
                viewModel.onDeliveringFinished({ id: 'learningPathId', publicationUrl: 'publicationUrl' });
                expect(viewModel.publicationUrl()).toBe('publicationUrl');
            });
        });

        describe('activate:', function () {
            var learningPath;

            beforeEach(function () {
                learningPath = {
                    id: 'learningPathId',
                    isPublishing: false,
                    isPublishedToExternalLms: true,
                    isDelivering: function () { return false; }
                };
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set isPublishing', function () {
                viewModel.isPublishing(null);
                viewModel.activate(learningPath);
                expect(viewModel.isPublishing()).toBe(learningPath.isPublishing);
            });

            it('should set isDelivering', function () {
                viewModel.isDelivering(null);
                viewModel.activate(learningPath);
                expect(viewModel.isDelivering()).toBe(learningPath.isDelivering());
            });

            it('should set isPublished', function () {
                viewModel.isPublished(null);
                viewModel.activate(learningPath);
                expect(viewModel.isPublished()).toBe(learningPath.isPublishedToExternalLms);
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

    });
});
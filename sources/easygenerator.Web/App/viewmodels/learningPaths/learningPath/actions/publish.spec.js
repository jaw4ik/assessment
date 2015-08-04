define(['viewmodels/learningPaths/learningPath/actions/publish'], function (publishAction) {
    'use strict';
    var
        viewModel,
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        clientContext = require('clientContext'),
        constants = require('constants'),
        router = require('plugins/router'),
        app = require('durandal/app');

    describe('viewModel [learningPath publish action]', function () {

        beforeEach(function () {
            viewModel = publishAction();
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'error');
            spyOn(router, 'openUrl');
            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        describe('learningPath:', function () {
            it('should be defined', function () {
                expect(viewModel.learningPath).toBeDefined();
            });
        });

        describe('publicationUrl:', function () {
            it('should be observable', function () {
                expect(viewModel.publicationUrl).toBeObservable();
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

        describe('linkCopied:', function () {
            it('should be observable', function () {
                expect(viewModel.linkCopied).toBeObservable();
            });
        });

        describe('embedCodeCopied:', function () {
            it('should be observable', function () {
                expect(viewModel.embedCodeCopied).toBeObservable();
            });
        });

        describe('copyDisabled:', function () {
            it('should be observable', function () {
                expect(viewModel.copyDisabled).toBeObservable();
            });
        });

        describe('publishAvailable:', function () {
            it('should be observable', function () {
                expect(viewModel.publishAvailable).toBeObservable();
            });
        });

        describe('frameWidth:', function () {

            it('should be observable', function () {
                expect(viewModel.frameWidth).toBeObservable();
            });

        });

        describe('frameHeight:', function () {

            it('should be observable', function () {
                expect(viewModel.frameHeight).toBeObservable();
            });

        });

        describe('embedCode:', function () {

            it('should be computed', function () {
                expect(viewModel.embedCode).toBeComputed();
            });

            it('should be equal embedCode', function () {
                viewModel.frameWidth(640);
                viewModel.frameHeight(480);
                viewModel.publicationUrl('publicationUrl');
                var embedCode = '<iframe width="640" height="480" src="publicationUrl" frameborder="0" allowfullscreen></iframe>';

                expect(viewModel.embedCode()).toBe(embedCode);
            });

        });

        describe('onCopyLink:', function () {

            it('should be function', function () {
                expect(viewModel.onCopyLink).toBeFunction();
            });

            it('should send event \'Copy publish link\'', function () {
                viewModel.eventCategory = 'category';
                viewModel.onCopyLink();
                expect(eventTracker.publish).toHaveBeenCalledWith('Copy publish link', 'category');
            });

        });

        describe('onCopyEmbedCode:', function () {

            it('should be function', function () {
                expect(viewModel.onCopyEmbedCode).toBeFunction();
            });

            it('should send event \'Copy embed code\'', function () {
                viewModel.eventCategory = 'category';
                viewModel.onCopyEmbedCode();
                expect(eventTracker.publish).toHaveBeenCalledWith('Copy embed code', 'category');
            });

        });

        describe('openPublicationUrl:', function () {

            it('should be function', function () {
                expect(viewModel.openPublicationUrl).toBeFunction();
            });

            describe('when publish link is empty', function () {
                it('should not open link', function () {
                    viewModel.publicationUrl('');
                    viewModel.openPublicationUrl();
                    expect(router.openUrl).not.toHaveBeenCalled();
                });
            });

            it('should open link', function () {
                viewModel.publicationUrl('publicationUrl');
                viewModel.openPublicationUrl();
                expect(router.openUrl).toHaveBeenCalledWith('publicationUrl');
            });

        });

        describe('validateFrameHeight:', function () {

            describe('when frame height is undefined', function () {
                it('should set default value', function () {
                    viewModel.frameHeight('');
                    viewModel.validateFrameHeight();
                    expect(viewModel.frameHeight()).toBe(constants.frameSize.height.value);
                });
            });

            describe('when frame height is 0', function () {
                it('should set default value', function () {
                    viewModel.frameHeight(0);
                    viewModel.validateFrameHeight();
                    expect(viewModel.frameHeight()).toBe(constants.frameSize.height.value);
                });
            });

            describe('when frame height is correct', function () {
                it('should not change value', function () {
                    viewModel.frameHeight(10);
                    viewModel.validateFrameHeight();
                    expect(viewModel.frameHeight()).toBe(10);
                });
            });

        });

        describe('validateFrameWidth:', function () {

            describe('when frame width is undefined', function () {
                it('should set default value', function () {
                    viewModel.frameWidth('');
                    viewModel.validateFrameWidth();
                    expect(viewModel.frameWidth()).toBe(constants.frameSize.width.value);
                });
            });

            describe('when frame width is 0', function () {
                it('should set default value', function () {
                    viewModel.frameWidth(0);
                    viewModel.validateFrameWidth();
                    expect(viewModel.frameWidth()).toBe(constants.frameSize.width.value);
                });
            });

            describe('when frame width is correct', function () {
                it('should not change value', function () {
                    viewModel.frameWidth(10);
                    viewModel.validateFrameWidth();
                    expect(viewModel.frameWidth()).toBe(10);
                });
            });

        });

        describe('publish:', function () {
            var publishDefer;

            beforeEach(function () {
                publishDefer = Q.defer();
                viewModel.isPublishing(false);
                viewModel.isDelivering(false);
                viewModel.learningPath = { publish: function () { } };
                spyOn(viewModel.learningPath, 'publish').and.returnValue(publishDefer.promise);
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

                it('should not build learningPath again', function () {
                    viewModel.publish();
                    expect(viewModel.learningPath.publish).not.toHaveBeenCalled();
                });

            });

            describe('when isDelivering is true', function () {

                beforeEach(function () {
                    viewModel.isDelivering(true);
                });

                it('should not build learningPath again', function () {
                    viewModel.publish();
                    expect(viewModel.learningPath.publish).not.toHaveBeenCalled();
                });

            });

            it('should set isPublishing in true', function () {
                viewModel.publish();
                expect(viewModel.isPublishing()).toBeTruthy();
            });

            it('should publish \'Publish learning path\' event', function () {
                viewModel.publish();
                expect(eventTracker.publish).toHaveBeenCalledWith('Publish learning path');
            });

            it('should publish learningPath', function () {
                viewModel.publish();
                expect(viewModel.learningPath.publish).toHaveBeenCalled();
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
                    publishDefer.resolve('publicationUrl');
                });

                it('should update publication url', function (done) {
                    viewModel.publicationUrl('');

                    viewModel.publish().fin(function () {
                        expect(viewModel.publicationUrl()).toBe('publicationUrl');
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
                    publicationUrl: 'publicationUrl',
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

            it('should set publicationUrl', function () {
                viewModel.publicationUrl(null);
                viewModel.activate(learningPath);
                expect(viewModel.publicationUrl()).toBe(learningPath.publicationUrl);
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

    });
});
import learningPathModel from './learningPath';

import publishService from 'services/publishService';
import app from 'durandal/app';
import constants from 'constants';

var learningPathId = 'learningPathId',
    learningPath = new learningPathModel({ id: learningPathId });

describe('model [learningPath]', function () {

    beforeEach(function() {
        spyOn(app, 'trigger');
    });

    describe('isDelivering:', function() {
        it('should be function', function() {
            expect(learningPath.isDelivering).toBeFunction();
        });

        describe('when learning path is building', function() {
            it('should return true', function() {
                learningPath.isBuilding = true;
                expect(learningPath.isDelivering()).toBeTruthy();
            });
        });

        describe('when learning path is publishing', function () {
            it('should return true', function () {
                learningPath.isPublishing = true;
                expect(learningPath.isDelivering()).toBeTruthy();
            });
        });

        describe('when learning path is not building or publishing', function () {
            it('should return false', function () {
                learningPath.isBuilding = false;
                learningPath.isPublishing = false;
                expect(learningPath.isDelivering()).toBeFalsy();
            });
        });
    });

    describe('build:', function () {

        var buildDefer;

        beforeEach(function () {
            buildDefer = Q.defer();
            spyOn(publishService, 'buildLearningPath').and.returnValue(buildDefer.promise);
            learningPath.isPublishing = false;
            learningPath.isBuilding = false;
        });

        it('should be function', function () {
            expect(learningPath.build).toBeFunction();
        });

        it('should return promise', function () {
            expect(learningPath.build()).toBePromise();
        });

        describe('when is learning path is building', function () {
            beforeEach(function () {
                learningPath.isBuilding = true;
                buildDefer.reject();
            });

            it('should not build learning path', function (done) {
                var promise = learningPath.build();

                promise.fin(function () {
                    expect(publishService.buildLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when is learning path is publishing', function () {
            beforeEach(function () {
                learningPath.isPublishing = true;
                buildDefer.reject();
            });

            it('should not build learning path', function (done) {
                var promise = learningPath.build();

                promise.fin(function () {
                    expect(publishService.buildLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        it('set isBuilding true', function (done) {
            buildDefer.reject();

            learningPath.build();

            buildDefer.promise.fin(function () {
                expect(learningPath.isBuilding).toBeTruthy();
                done();
            });
        });

        it('should rise delivering started event', function(done) {
            buildDefer.reject();

            learningPath.build();

            buildDefer.promise.fin(function () {
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.started + learningPathId, learningPath);
                done();
            });
        });

        it('should build learning path', function (done) {
            buildDefer.reject();

            var promise = learningPath.build();

            promise.fin(function () {
                expect(publishService.buildLearningPath).toHaveBeenCalledWith(learningPathId);
                done();
            });
        });

        describe('when build is failed', function () {
            beforeEach(function () {
                buildDefer.reject('error message');
            });

            it('should reject promise with error message', function (done) {
                var promise = learningPath.build();

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('error message');
                    done();
                });
            });

            it('should set isBuilding false', function (done) {
                var promise = learningPath.build();

                promise.fin(function () {
                    expect(learningPath.isBuilding).toBeFalsy();
                    done();
                });
            });

            it('should rise delivering finished event', function (done) {
                var promise = learningPath.build();

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                    done();
                });
            });

        });

        describe('when build is succed', function () {
            beforeEach(function () {
                buildDefer.resolve({ packageUrl: 'packageUrl' });
            });

            it('should resolve promise with packageUrl', function (done) {
                var promise = learningPath.build();

                promise.fin(function () {
                    expect(promise).toBeResolvedWith('packageUrl');
                    done();
                });
            });

            it('should set isBuilding false', function (done) {
                var promise = learningPath.build();

                promise.fin(function () {
                    expect(learningPath.isBuilding).toBeFalsy();
                    done();
                });
            });

            it('should rise delivering finished event', function (done) {
                var promise = learningPath.build();

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                    done();
                });
            });
        });
    });

    describe('publish:', function () {

        var buildDefer,
            publishDefer;

        beforeEach(function () {
            buildDefer = Q.defer();
            publishDefer = Q.defer();
            spyOn(publishService, 'buildLearningPath').and.returnValue(buildDefer.promise);
            spyOn(publishService, 'publishLearningPath').and.returnValue(publishDefer.promise);
            learningPath.isPublishing = false;
            learningPath.isBuilding = false;
        });

        it('should be function', function () {
            expect(learningPath.publish).toBeFunction();
        });

        it('should return promise', function () {
            expect(learningPath.publish()).toBePromise();
        });

        describe('when is isBuilding is true', function () {
            beforeEach(function () {
                learningPath.isBuilding = true;
                buildDefer.reject();
                publishDefer.reject();
            });

            it('should not build learning path', function (done) {
                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(publishService.buildLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not publish learning path', function (done) {
                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(publishService.publishLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when is isPublishing is true', function () {
            beforeEach(function () {
                learningPath.isPublishing = true;
                buildDefer.reject();
                publishDefer.reject();
            });

            it('should not build learning path', function (done) {
                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(publishService.buildLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not publish learning path', function (done) {
                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(publishService.publishLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        it('set isPublishing true', function (done) {
            buildDefer.reject();

            learningPath.publish();

            buildDefer.promise.fin(function () {
                expect(learningPath.isPublishing).toBeTruthy();
                done();
            });
        });

        it('should rise delivering started event', function (done) {
            buildDefer.reject();

            learningPath.publish();

            buildDefer.promise.fin(function () {
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.started + learningPathId, learningPath);
                done();
            });
        });

        it('should build learning path', function (done) {
            buildDefer.reject();
            publishDefer.reject();

            var promise = learningPath.publish();

            promise.fin(function () {
                expect(publishService.buildLearningPath).toHaveBeenCalledWith(learningPathId);
                done();
            });
        });

        describe('when build is failed', function () {
            beforeEach(function () {
                buildDefer.reject('error message');
            });

            it('should not publish learning path', function (done) {
                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(publishService.publishLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not reset publicationUrl', function (done) {
                learningPath.publicationUrl = 'publicationUrl';

                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(learningPath.publicationUrl).toBe('publicationUrl');
                    done();
                });
            });

            it('should reject promise with error message', function (done) {
                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('error message');
                    done();
                });
            });

            it('should set isPublishing false', function (done) {
                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(learningPath.isPublishing).toBeFalsy();
                    done();
                });
            });

            it('should rise delivering finished event', function (done) {
                var promise = learningPath.publish();

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                    done();
                });
            });

        });

        describe('when build is succed', function () {

            beforeEach(function () {
                buildDefer.resolve();
            });

            it('should publish learning path', function (done) {
                var promise = learningPath.publish();
                publishDefer.reject();

                promise.fin(function () {
                    expect(publishService.publishLearningPath).toHaveBeenCalledWith(learningPathId);
                    done();
                });
            });

            describe('and publish is failed', function () {
                beforeEach(function () {
                    publishDefer.reject('publish error message');
                });

                it('should reset publicationUrl', function (done) {
                    learningPath.publicationUrl = 'publicationUrl';

                    var promise = learningPath.publish();

                    promise.fin(function () {
                        expect(learningPath.publicationUrl).toBeNull();
                        done();
                    });
                });

                it('should reject promise with publish error message', function (done) {
                    var promise = learningPath.publish();

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('publish error message');
                        done();
                    });
                });

                it('should set isPublishing false', function (done) {
                    var promise = learningPath.publish();

                    promise.fin(function () {
                        expect(learningPath.isPublishing).toBeFalsy();
                        done();
                    });
                });

                it('should rise delivering finished event', function (done) {
                    var promise = learningPath.publish();

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                        done();
                    });
                });
            });

            describe('and publish is succed', function () {
                beforeEach(function () {
                    publishDefer.resolve({ publicationUrl: 'publicationUrl' });
                });

                it('should resolve promise with publicationUrl', function (done) {
                    var promise = learningPath.publish();

                    promise.fin(function () {
                        expect(promise).toBeResolvedWith('publicationUrl');
                        done();
                    });
                });

                it('should set isPublishing false', function (done) {
                    var promise = learningPath.publish();

                    promise.fin(function () {
                        expect(learningPath.isPublishing).toBeFalsy();
                        done();
                    });
                });

                it('should rise delivering finished event', function (done) {
                    var promise = learningPath.publish();

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                        done();
                    });
                });
            });

        });

    });

    describe('publishToCustomLms:', function () {

        var buildDefer,
            publishDefer,
            publishToCustomLmsDefer;

        beforeEach(function () {
            buildDefer = Q.defer();
            publishDefer = Q.defer();
            publishToCustomLmsDefer = Q.defer();
            spyOn(publishService, 'buildLearningPath').and.returnValue(buildDefer.promise);
            spyOn(publishService, 'publishLearningPath').and.returnValue(publishDefer.promise);
            spyOn(publishService, 'publishLearningPathToCustomLms').and.returnValue(publishToCustomLmsDefer.promise);
            learningPath.isPublishing = false;
            learningPath.isBuilding = false;
        });

        it('should be function', function () {
            expect(learningPath.publishToCustomLms).toBeFunction();
        });

        it('should return promise', function () {
            expect(learningPath.publishToCustomLms()).toBePromise();
        });

        describe('when is isBuilding is true', function () {
            beforeEach(function () {
                learningPath.isBuilding = true;
                buildDefer.reject();
                publishDefer.reject();
                publishToCustomLmsDefer.reject();
            });

            it('should not build learning path', function (done) {
                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(publishService.buildLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not publish learning path', function (done) {
                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(publishService.publishLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when is isPublishing is true', function () {
            beforeEach(function () {
                learningPath.isPublishing = true;
                buildDefer.reject();
                publishDefer.reject();
                publishToCustomLmsDefer.reject();
            });

            it('should not build learning path', function (done) {
                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(publishService.buildLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not publish learning path', function (done) {
                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(publishService.publishLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        it('set isPublishing true', function (done) {
            buildDefer.reject();

            learningPath.publishToCustomLms();

            buildDefer.promise.fin(function () {
                expect(learningPath.isPublishing).toBeTruthy();
                done();
            });
        });

        it('should rise delivering started event', function (done) {
            buildDefer.reject();

            learningPath.publishToCustomLms();

            buildDefer.promise.fin(function () {
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.started + learningPathId, learningPath);
                done();
            });
        });

        it('should build learning path', function (done) {
            buildDefer.reject();
            publishDefer.reject();

            var promise = learningPath.publishToCustomLms();

            promise.fin(function () {
                expect(publishService.buildLearningPath).toHaveBeenCalledWith(learningPathId);
                done();
            });
        });

        describe('when build is failed', function () {
            beforeEach(function () {
                buildDefer.reject('error message');
            });

            it('should not publish learning path', function (done) {
                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(publishService.publishLearningPath).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not reset publicationUrl', function (done) {
                learningPath.publicationUrl = 'publicationUrl';

                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(learningPath.publicationUrl).toBe('publicationUrl');
                    done();
                });
            });

            it('should reject promise with error message', function (done) {
                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('error message');
                    done();
                });
            });

            it('should set isPublishing false', function (done) {
                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(learningPath.isPublishing).toBeFalsy();
                    done();
                });
            });

            it('should rise delivering finished event', function (done) {
                var promise = learningPath.publishToCustomLms();

                promise.fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                    done();
                });
            });

        });

        describe('when build is succed', function () {

            beforeEach(function () {
                buildDefer.resolve();
            });

            it('should publish learning path', function (done) {
                var promise = learningPath.publishToCustomLms();
                publishDefer.reject();

                promise.fin(function () {
                    expect(publishService.publishLearningPath).toHaveBeenCalledWith(learningPathId);
                    done();
                });
            });

            describe('and publish is failed', function () {
                beforeEach(function () {
                    publishDefer.reject('publish error message');
                });

                it('should reset publicationUrl', function (done) {
                    learningPath.publicationUrl = 'publicationUrl';

                    var promise = learningPath.publishToCustomLms();

                    promise.fin(function () {
                        expect(learningPath.publicationUrl).toBeNull();
                        done();
                    });
                });

                it('should reject promise with publish error message', function (done) {
                    var promise = learningPath.publishToCustomLms();

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('publish error message');
                        done();
                    });
                });

                it('should set isPublishing false', function (done) {
                    var promise = learningPath.publishToCustomLms();

                    promise.fin(function () {
                        expect(learningPath.isPublishing).toBeFalsy();
                        done();
                    });
                });

                it('should rise delivering finished event', function (done) {
                    var promise = learningPath.publishToCustomLms();

                    promise.fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                        done();
                    });
                });
            });

            describe('and publish is succed', function () {
                beforeEach(function () {
                    publishDefer.resolve({ publicationUrl: 'publicationUrl' });
                });

                it('should set publicationUrl', function (done) {
                    learningPath.publicationUrl = "";
                    publishToCustomLmsDefer.resolve();
                    var promise = learningPath.publishToCustomLms();
                        

                    promise.fin(function () {
                        expect(learningPath.publicationUrl).toBe('publicationUrl');
                        done();
                    });
                });

                it('should publish learning path to custom LMS', function(done) {
                    var promise = learningPath.publishToCustomLms('companyId');
                    publishToCustomLmsDefer.reject();

                    promise.fin(function () {
                        expect(publishService.publishLearningPathToCustomLms).toHaveBeenCalledWith(learningPathId, 'companyId');
                        done();
                    });
                });

                describe('and publish to custom LMS is failed', function() {
                    beforeEach(function() {
                        publishToCustomLmsDefer.reject('publish to custom LMS error message');
                    });

                    it('should not reset publicationUrl', function (done) {
                        learningPath.publicationUrl = 'publicationUrl';

                        var promise = learningPath.publishToCustomLms();

                        promise.fin(function () {
                            expect(learningPath.publicationUrl).toBe('publicationUrl');
                            done();
                        });
                    });

                    it('should reject promise with publish error message', function (done) {
                        var promise = learningPath.publishToCustomLms();

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('publish to custom LMS error message');
                            done();
                        });
                    });

                    it('should set isPublishing false', function (done) {
                        var promise = learningPath.publishToCustomLms();

                        promise.fin(function () {
                            expect(learningPath.isPublishing).toBeFalsy();
                            done();
                        });
                    });

                    it('should rise delivering finished event', function (done) {
                        var promise = learningPath.publishToCustomLms();

                        promise.fin(function () {
                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                            done();
                        });
                    });
                });

                describe('and publish to custom LMS is succed', function() {
                    beforeEach(function() {
                        publishToCustomLmsDefer.resolve();
                    });

                    it('should add company to list', function (done) {
                        learningPath.learningPathCompanies = [];
                        var promise = learningPath.publishToCustomLms('companyId');

                        promise.fin(function () {
                            expect(learningPath.learningPathCompanies[0].id).toBe('companyId');
                            done();
                        });
                    });

                    it('should set isPublishing false', function (done) {
                        var promise = learningPath.publishToCustomLms();

                        promise.fin(function () {
                            expect(learningPath.isPublishing).toBeFalsy();
                            done();
                        });
                    });

                    it('should rise delivering finished event', function (done) {
                        var promise = learningPath.publishToCustomLms();

                        promise.fin(function () {
                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPathId, learningPath);
                            done();
                        });
                    });
                });

            });

        });

    });
});
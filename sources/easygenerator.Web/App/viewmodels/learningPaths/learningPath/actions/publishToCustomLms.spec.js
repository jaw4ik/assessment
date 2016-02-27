import publishAction from './publishToCustomLms';

import getLearningPathByIdQuery from './../queries/getLearningPathByIdQuery';
import notify from 'notify';
import eventTracker from 'eventTracker';
import constants from 'constants';
import app from 'durandal/app';

describe('viewModel [learningPath publish to custom LMS action]', function () {

    var viewModel;
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
            viewModel.companyInfo = {};
            viewModel.publish();
            expect(viewModel.isPublishing()).toBeTruthy();
        });

        it('should publish \'Publish learning path to custom hosting\' event', function () {
            viewModel.companyInfo = {};
            viewModel.publish();
            expect(eventTracker.publish).toHaveBeenCalledWith('Publish learning path to custom hosting');
        });

        it('should publish learningPath to custom LMS', function () {
            viewModel.companyInfo = { id: 'companyId' };
            viewModel.publish();
            expect(viewModel.learningPath.publishToCustomLms).toHaveBeenCalledWith('companyId');
        });

        describe('when publish failed', function () {
            beforeEach(function () {
                publishDefer.reject('error message');
                viewModel.companyInfo = {};
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
                viewModel.companyInfo = {};
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

        it('should set isPublished', function () {
            var company = { id: 'companyId' };
            viewModel.companyInfo = company;
            viewModel.isPublished(null);
            viewModel.onDeliveringFinished({ id: 'learningPathId', learningPathCompanies: [company] });
            expect(viewModel.isPublished()).toBeTruthy();
        });

        it('should set isDelivering false', function () {
            var company = { id: 'companyId' };
            viewModel.companyInfo = company;
            viewModel.isDelivering(true);
            viewModel.onDeliveringFinished({ id: 'learningPathId', learningPathCompanies: [company] });
            expect(viewModel.isDelivering()).toBeFalsy();
        });

        it('should update publishing state', function () {
            var company = { id: 'companyId' };
            viewModel.companyInfo = company;
            viewModel.isPublishing(true);
            viewModel.onDeliveringFinished({ id: 'learningPathId', isPublishing: false, learningPathCompanies: [company] });
            expect(viewModel.isPublishing()).toBeFalsy();
        });

    });

    describe('activate:', function () {
        var learningPathId = 'learningPathId',
            learningPath,
            getLearningPathDfr;

        beforeEach(function () {
            getLearningPathDfr = Q.defer();
            spyOn(getLearningPathByIdQuery, 'execute').and.returnValue(getLearningPathDfr.promise);

            learningPath = {
                id: 'learningPathId',
                isPublishing: false,
                learningPathCompanies: [],
                isDelivering: function () { return false; }
            };
        });

        it('should be function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function() {
            expect(viewModel.activate({ learningPathId: learningPathId })).toBePromise();
        });

        it('should get learningPath by id', function() {
            viewModel.activate({ learningPathId: learningPathId });
            expect(getLearningPathByIdQuery.execute).toHaveBeenCalledWith(learningPathId);
        });

        describe('when learning path is returned', function() {
            beforeEach(function() {
                getLearningPathDfr.resolve(learningPath);
            });

            it('should set isPublishing', function (done) {
                viewModel.isPublishing(null);
                var promise = viewModel.activate({ learningPathId: learningPathId });
                promise.fin(function() {
                    expect(viewModel.isPublishing()).toBe(learningPath.isPublishing);
                    done();
                });
            });

            it('should set companyInfo', function (done) {
                var company = { id: 'companyId' };
                viewModel.companyInfo = null;

                var promise = viewModel.activate({ learningPathId: learningPathId, companyInfo: company });
                promise.fin(function () {
                    expect(viewModel.companyInfo).toBe(company);
                    done();
                });
            });

            it('should set isDelivering', function (done) {
                viewModel.isDelivering(null);
                var promise = viewModel.activate({ learningPathId: learningPathId });
                promise.fin(function () {
                    expect(viewModel.isDelivering()).toBe(learningPath.isDelivering());
                    done();
                });
            });

            it('should set isPublished', function (done) {
                viewModel.companyInfo = { id: '123' };
                viewModel.isPublished(null);
                var promise = viewModel.activate({ learningPathId: learningPathId });
                promise.fin(function () {
                    expect(viewModel.isPublished()).toBe(!!learningPath.learningPathCompanies.find(function (company) {
                        return company.id === viewModel.companyInfo.id;
                    }));
                    done();
                });
            });


            it('should on learning path delivering started event', function (done) {
                var promise = viewModel.activate({ learningPathId: learningPathId });
                promise.fin(function () {
                    expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.delivering.started + learningPath.id, viewModel.onDeliveringStarted);
                    done();
                });
            });

            it('should on learning path delivering finished event', function (done) {
                var promise = viewModel.activate({ learningPathId: learningPathId });
                promise.fin(function () {
                    expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.delivering.finished + learningPath.id, viewModel.onDeliveringFinished);
                    done();
                });
            });

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
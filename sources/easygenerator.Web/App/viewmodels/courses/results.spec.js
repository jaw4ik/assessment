define(['viewmodels/courses/results'], function (viewModel) {
    "use strict";

    var
        eventTracker = require('eventTracker'),
        localizationManager = require('localization/localizationManager'),
        ping = require('ping'),
        BackButton = require('models/backButton'),
        xApiProvider = require('reporting/xApiProvider'),
        constants = require('constants'),
        dialog = require('plugins/dialog'),
        userContext = require('userContext'),
        router = require('plugins/router');

    describe('viewModel [results]', function () {

        var courseId;
        beforeEach(function () {
            courseId = 'courseId';
            spyOn(eventTracker, 'publish');
            spyOn(router, 'openUrl');
        });

        describe('isResultsDialogShown:', function () {

            it('should be observable', function () {
                expect(viewModel.isResultsDialogShown).toBeObservable();
            });

        });

        describe('upgradeNow:', function () {

            it('should be function', function () {
                expect(viewModel.upgradeNow).toBeFunction();
            });

            it('should close dialog', function () {
                viewModel.upgradeNow();
                expect(viewModel.isResultsDialogShown()).toBeFalsy();
            });

            it('should send event \'Upgrade now\'', function () {
                viewModel.upgradeNow();
                expect(eventTracker.publish).toHaveBeenCalledWith('Upgrade now', 'Load more results');
            });

            it('should open upgrade url', function () {
                viewModel.upgradeNow();
                expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
            });

        });

        describe('skipUpgrage:', function () {

            it('should be function', function () {
                expect(viewModel.skipUpgrage).toBeFunction();
            });

            it('should close dialog', function () {
                viewModel.skipUpgrage();
                expect(viewModel.isResultsDialogShown()).toBeFalsy();
            });

            it('should send event \'Skip upgrade\'', function () {
                viewModel.skipUpgrage();
                expect(eventTracker.publish).toHaveBeenCalledWith('Skip upgrade', 'Load more results');
            });

        });

        describe('showMoreResults:', function () {

            beforeEach(function () {
                spyOn(dialog, 'show');
            });

            it('should be function', function () {
                expect(viewModel.showMoreResults).toBeFunction();
            });

            it('should send event \'Show more results\'', function () {
                viewModel.showMoreResults();
                expect(eventTracker.publish).toHaveBeenCalledWith('Show more results');
            });

            describe('when there are no more results to show', function () {

                beforeEach(function () {
                    viewModel.loadedResults = [];
                    viewModel.results(viewModel.loadedResults);
                });

                it('should not change page number', function () {
                    viewModel.pageNumber = 1;
                    viewModel.showMoreResults();
                    expect(viewModel.pageNumber).toEqual(1);
                });

            });

            describe('when not all results are shown', function () {

                beforeEach(function () {
                    viewModel.pageNumber = 0;
                    viewModel.loadedResults = [1, 2, 3];
                    viewModel.results([]);
                });

                describe('when user access type allows to view more results', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            email: 'test@test.com',
                            subscription: {
                                accessType: 2,
                                expirationDate: new Date().setYear(2055)
                            }
                        };
                    });

                    it('should increase page number', function () {
                        var pageNumber = viewModel.pageNumber;
                        viewModel.showMoreResults();
                        expect(viewModel.pageNumber).toEqual(pageNumber + 1);
                    });

                    it('should add loaded result for new page to results array', function () {
                        constants.courseResults.pageSize = 1;
                        viewModel.showMoreResults();
                        expect(viewModel.results().length).toEqual(viewModel.pageNumber * constants.courseResults.pageSize);
                    });

                });


                describe('when user access type forbids to view more results', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            email: 'test@test.com',
                            subscription: {
                                accessType: 0,
                                expirationDate: new Date().setYear(1990)
                            }
                        };
                    });

                    it('should not increase page number', function () {
                        var pageNumber = viewModel.pageNumber;
                        viewModel.showMoreResults();
                        expect(viewModel.pageNumber).toEqual(pageNumber);
                    });

                    it('should show upgrade results dialog', function () {
                        viewModel.showMoreResults();
                        expect(viewModel.isResultsDialogShown()).toBeTruthy();
                    });

                    it('should not add loaded result for new page to results array', function () {
                        viewModel.showMoreResults();
                        expect(viewModel.results().length).toEqual(0);
                    });

                });

            });

        });

        describe('hasMoreResults:', function () {

            it('should be observable', function () {
                expect(viewModel.hasMoreResults).toBeComputed();
            });

            describe('when shown more results than loaded', function () {

                it('should return true', function () {
                    viewModel.loadedResults = [1, 2, 3];
                    viewModel.results([viewModel.loadedResults[0]]);

                    expect(viewModel.hasMoreResults()).toBeTruthy();
                });

            });

            describe('when all loaded results shown', function () {

                it('should return false', function () {
                    viewModel.loadedResults = [1, 2, 3];
                    viewModel.results(viewModel.loadedResults);

                    expect(viewModel.hasMoreResults()).toBeFalsy();
                });

            });

        });

        describe('pageNumber:', function () {

            it('should be number', function () {
                expect(viewModel.pageNumber).toBeNumber();
            });

        });

        describe('loadedResults:', function () {

            it('should be observable', function () {
                expect(viewModel.loadedResults).toBeArray();
            });

        });

        describe('navigateToCoursesEvent:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToCoursesEvent).toBeFunction();
            });

            it('should send event \'Navigate to courses\'', function () {
                viewModel.navigateToCoursesEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
            });

        });

        describe('canActivate:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(ping, 'execute').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.canActivate()).toBePromise();
            });

            it('should ping', function () {
                viewModel.canActivate();
                expect(ping.execute).toHaveBeenCalled();
            });

            describe('when ping failed', function () {

                beforeEach(function () {
                    dfd.reject();
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.canActivate();
                    promise.fin(function () {
                        expect(promise).toBeRejected();
                        done();
                    });
                });

            });

            describe('when ping succeed', function () {

                beforeEach(function () {
                    dfd.resolve();
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.canActivate();
                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

            });

        });

        describe('backButtonData:', function () {

            it('should be instance of BackButton', function () {
                expect(viewModel.backButtonData).toBeInstanceOf(BackButton);
            });

            it('should be configured', function () {
                expect(viewModel.backButtonData.url).toBe('courses');
                expect(viewModel.backButtonData.backViewName).toBe(localizationManager.localize('courses'));
                expect(viewModel.backButtonData.callback).toBe(viewModel.navigateToCoursesEvent);
            });

        });

        describe('isLoading:', function () {

            it('should be observable', function () {
                expect(viewModel.isLoading).toBeObservable();
            });

            it('should be true observable by default', function () {
                expect(viewModel.isLoading()).toBeTruthy();
            });
        });

        describe('results:', function () {

            it('should be observable array', function () {
                expect(viewModel.results).toBeObservableArray();
            });

        });

        describe('noResults:', function () {
            it('should be computed', function () {
                expect(viewModel.noResults).toBeComputed();
            });

            it('should be true if results field contains no elements', function () {
                viewModel.results([]);
                expect(viewModel.noResults()).toBeTruthy();
            });

            it('should be false if results field contains the elements', function () {
                viewModel.results(['some element']);
                expect(viewModel.noResults()).toBeFalsy();
            });
        });

        describe('activate:', function () {

            it('should fill courseId for viewModel', function () {
                viewModel.activate(courseId);
                expect(viewModel.courseId).toBe(courseId);
            });

            it('should empty results array', function () {
                viewModel.results(['element1', 'element2']);
                viewModel.activate(courseId);
                expect(viewModel.results().length).toBe(0);
            });

            it('should empty loaded results', function () {
                viewModel.loadedResults = ['element1', 'element2'];
                viewModel.activate(courseId);
                expect(viewModel.loadedResults.length).toBe(0);
            });

            it('should reset page to first', function () {
                viewModel.activate(courseId);
                expect(viewModel.pageNumber).toBe(1);
            });

            it('should reset isResultsDialogShown', function () {
                viewModel.isResultsDialogShown(true);
                viewModel.activate(courseId);
                expect(viewModel.isResultsDialogShown()).toBeFalsy();
            });

        });

        describe('attached:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(xApiProvider, 'getReportingStatements').and.returnValue(dfd.promise);;
            });

            it('should return a promise', function () {
                viewModel.activate(courseId);
                expect(viewModel.attached()).toBePromise();
            });

            describe('when getReportingStatements failed', function () {

                beforeEach(function () {
                    dfd.reject();
                });

                it('should set isLoading to false', function (done) {
                    viewModel.activate(courseId);
                    var promise = viewModel.attached();
                    promise.fin(function () {
                        expect(viewModel.isLoading()).toBeFalsy();
                        done();
                    });
                });

            });

            describe('when getReportingStatements returned statements', function () {

                var statements;

                beforeEach(function () {
                    statements = [
                    {
                        id: 1,
                        date: new Date(Date.parse('2013-12-27T07:58:07.617000+00:00'))
                    },
                    {
                        id: 2,
                        date: new Date(Date.parse('2014-10-27T07:58:07.617000+00:00'))
                    }];
                    dfd.resolve(statements);
                });

                it('should fill results field with results for first page', function (done) {
                    constants.courseResults.pageSize = 1;
                    viewModel.activate(courseId);
                    var promise = viewModel.attached();
                    promise.fin(function () {
                        expect(viewModel.results()[0]).toBe(statements[1]);
                        expect(viewModel.results().length).toBe(1);
                        done();
                    });
                });

                it('should fill loadedResults field with returned statements in sorted order', function (done) {
                    viewModel.activate(courseId);
                    var promise = viewModel.attached();
                    promise.fin(function () {
                        expect(viewModel.loadedResults[0]).toBe(statements[1]);
                        expect(viewModel.loadedResults[1]).toBe(statements[0]);
                        done();
                    });
                });

                it('should set isLoading to false', function (done) {
                    viewModel.activate(courseId);
                    var promise = viewModel.attached();
                    promise.fin(function () {
                        expect(viewModel.isLoading()).toBeFalsy();
                        done();
                    });
                });

            });

        });

        describe('getLearnerName', function () {
            it('should return name in correct format', function () {
                var formattedName = viewModel.getLearnerName({ name: 'name', email: 'email@domain.com' });
                expect(formattedName).toBe('name (email@domain.com)');
            });
        });

    });

});

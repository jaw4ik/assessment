define(['viewmodels/courses/course/results'], function (viewModel) {
    "use strict";

    var
        eventTracker = require('eventTracker'),
        courseRepository = require('repositories/courseRepository'),
        xApiProvider = require('reporting/xApiProvider'),
        constants = require('constants'),
        dialog = require('plugins/dialog'),
        userContext = require('userContext'),
        router = require('plugins/router');

    describe('viewModel [results]', function () {

        var courseId,
            getCourseDefer;
        var time = '2015-02-03_05-38';

        var fakeMoment = {
            format: function () {
                return time;
            }
        };

        beforeEach(function () {
            getCourseDefer = Q.defer();
            courseId = 'courseId';
            spyOn(window, 'saveAs');
            spyOn(eventTracker, 'publish');
            spyOn(router, 'openUrl');
            spyOn(courseRepository, 'getById').and.returnValue(getCourseDefer.promise);

            spyOn(window, 'moment').and.returnValue(fakeMoment);
            spyOn(fakeMoment, 'format').and.returnValue(time);
        });

        describe('isResultsDialogShown:', function () {

            it('should be observable', function () {
                expect(viewModel.isResultsDialogShown).toBeObservable();
            });

        });

        describe('upgradeNowForLoadMore:', function () {

            it('should be function', function () {
                expect(viewModel.upgradeNowForLoadMore).toBeFunction();
            });

            it('should close dialog', function () {
                viewModel.upgradeNowForLoadMore();
                expect(viewModel.isResultsDialogShown()).toBeFalsy();
            });

            it('should send event \'Upgrade now\'', function () {
                viewModel.upgradeNowForLoadMore();
                expect(eventTracker.publish).toHaveBeenCalledWith('Upgrade now', 'Load more results');
            });

            it('should open upgrade url', function () {
                viewModel.upgradeNowForLoadMore();
                expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
            });

        });

        describe('upgradeNowForDownloadCsv:', function () {

            it('should be function', function () {
                expect(viewModel.upgradeNowForDownloadCsv).toBeFunction();
            });

            it('should close dialog', function () {
                viewModel.upgradeNowForDownloadCsv();
                expect(viewModel.isDownloadDialogShown()).toBeFalsy();
            });

            it('should send event \'Upgrade now\'', function () {
                viewModel.upgradeNowForDownloadCsv();
                expect(eventTracker.publish).toHaveBeenCalledWith('Upgrade now', 'Download results CSV');
            });

            it('should open upgrade url', function () {
                viewModel.upgradeNowForDownloadCsv();
                expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
            });

        });

        describe('skipUpgradeForLoadMore:', function () {

            it('should be function', function () {
                expect(viewModel.skipUpgradeForLoadMore).toBeFunction();
            });

            it('should close dialog', function () {
                viewModel.skipUpgradeForLoadMore();
                expect(viewModel.isResultsDialogShown()).toBeFalsy();
            });

            it('should send event \'Skip upgrade\'', function () {
                viewModel.skipUpgradeForLoadMore();
                expect(eventTracker.publish).toHaveBeenCalledWith('Skip upgrade', 'Load more results');
            });

        });

        describe('skipUpgradeForDownloadCsv:', function () {

            it('should be function', function () {
                expect(viewModel.skipUpgradeForDownloadCsv).toBeFunction();
            });

            it('should close dialog', function () {
                viewModel.skipUpgradeForDownloadCsv();
                expect(viewModel.isDownloadDialogShown()).toBeFalsy();
            });

            it('should send event \'Skip upgrade\'', function () {
                viewModel.skipUpgradeForDownloadCsv();
                expect(eventTracker.publish).toHaveBeenCalledWith('Skip upgrade', 'Download results CSV');
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

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should get course from repository', function () {
                var courseId = 'courseId';
                viewModel.activate(courseId);
                expect(courseRepository.getById).toHaveBeenCalledWith(courseId);
            });

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

            it('should reset isDownloadDialogShown', function () {
                viewModel.isDownloadDialogShown(true);
                viewModel.activate(courseId);
                expect(viewModel.isDownloadDialogShown()).toBeFalsy();
            });

            it('should reset isDownloadDialogShown', function () {
                viewModel.isDownloadDialogShown(true);
                viewModel.activate(courseId);
                expect(viewModel.isDownloadDialogShown()).toBeFalsy();
            });

            describe('when course exists', function () {

                var
                    course = { id: 'courseId', title: 'title' };

                beforeEach(function () {
                    getCourseDefer.resolve(course);
                });

                it('should set courseTitle', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.courseTitle).toBe(course.title);
                        done();
                    });
                });
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

        describe('downloadResults:', function () {

            it('should be function', function () {
                expect(viewModel.downloadResults).toBeFunction();
            });

            it('should send event \'Download results\'', function () {
                viewModel.downloadResults();
                expect(eventTracker.publish).toHaveBeenCalledWith('Download results');
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

                it('should call saveAs', function () {
                    viewModel.downloadResults();
                    expect(window.saveAs).toHaveBeenCalledWith(viewModel.generateResultsCsvBlob(), viewModel.getResultsFileName());
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

                it('should show upgrade results dialog', function () {
                    viewModel.downloadResults();
                    expect(viewModel.isDownloadDialogShown()).toBeTruthy();
                });

                it('should not call saveAs', function () {
                    viewModel.downloadResults();
                    expect(window.saveAs).not.toHaveBeenCalled();
                });

            });

        });

        describe('getResultsFileName:', function () {

            it('should be function', function () {
                expect(viewModel.getResultsFileName).toBeFunction();
            });

            it('should call moment', function () {
                var a = viewModel.getResultsFileName();
                expect(moment().format).toHaveBeenCalled();
            });

            it('should call moment', function () {
                viewModel.courseTitle = 'Course-123.\\/ фывяй 续约我的服务';
                var a = viewModel.getResultsFileName();
                expect(a).toBe('results_Course-123_2015-02-03_05-38.csv');
            });

        });

        describe('generateResultsCsvBlob:', function () {

            it('should be function', function () {
                expect(viewModel.generateResultsCsvBlob).toBeFunction();
            });

        });

    });

});

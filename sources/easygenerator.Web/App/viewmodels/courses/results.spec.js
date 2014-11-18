define(['viewmodels/courses/results'], function (viewModel) {
    "use strict";

    var
        eventTracker = require('eventTracker'),
        localizationManager = require('localization/localizationManager'),
        ping = require('ping'),
        BackButton = require('models/backButton'),
        xApiProvider = require('reporting/xApiProvider');

    describe('viewModel [results]', function () {
        var courseId;
        beforeEach(function () {
            courseId = 'courseId';
            spyOn(eventTracker, 'publish');
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
            it('should be observable array with no elements', function () {
                expect(viewModel.results).toBeObservableArray();
                expect(viewModel.results().length).toBe(0);
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

        describe('activate:', function() {
            it('should fill courseId for viewModel', function() {
                viewModel.activate(courseId);
                expect(viewModel.courseId).toBe(courseId);
            });

            it('should empty results array', function () {
                viewModel.results(['element1', 'element2']);
                viewModel.activate(courseId);
                expect(viewModel.results().length).toBe(0);
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

                it('should fill results field with returned statements in sorted order', function (done) {
                    viewModel.activate(courseId);
                    var promise = viewModel.attached();
                    promise.fin(function () {
                        expect(viewModel.results()[0]).toBe(statements[1]);
                        expect(viewModel.results()[1]).toBe(statements[0]);
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

        describe('getLearnerName', function() {
            it('should return name in correct format', function() {
                var formattedName = viewModel.getLearnerName({ name: 'name', email: 'email@domain.com' });
                expect(formattedName).toBe('name (email@domain.com)');
            });
        });
    });
});

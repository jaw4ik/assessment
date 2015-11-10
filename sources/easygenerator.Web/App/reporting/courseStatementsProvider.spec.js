define(['reporting/courseStatementsProvider'], function(provider) {
    'use strict';

    var xApiProvider = require('reporting/xApiProvider');

    var courseId = 'courseId',
        startedStatements = [{ attemptId: '1' }, { attemptId: '2' }],
        finishedStatements = [{ attemptId: '2' }];

    describe('courseStatementsProvider:', function() {
        it('should be object', function() {
            expect(provider).toBeObject();
        });

        describe('getLrsStatements:', function() {
            var getStartedDfr,
                getFinishedDfr,
                getFinishedByAttemptsDfr;

            beforeEach(function() {
                getStartedDfr = Q.defer();
                getFinishedDfr  = Q.defer();
                getFinishedByAttemptsDfr = Q.defer();

                spyOn(xApiProvider, 'getCourseStartedStatements').and.returnValue(getStartedDfr.promise);
                spyOn(xApiProvider, 'getCourseFinishedStatements').and.returnValue(getFinishedDfr.promise);
                spyOn(xApiProvider, 'getCourseFinishedStatementsByAttempts').and.returnValue(getFinishedByAttemptsDfr.promise);
            });

            it('should be function', function() {
                expect(provider.getLrsStatements).toBeFunction();
            });

            it('should return promise', function() {
                expect(provider.getLrsStatements()).toBePromise();
            });

            describe('when get all', function() {
                it('should get course started statements', function() {
                    provider.getLrsStatements(courseId);

                    expect(xApiProvider.getCourseStartedStatements).toHaveBeenCalledWith(courseId);
                });

                it('should get course finished statements', function() {
                    provider.getLrsStatements(courseId);

                    expect(xApiProvider.getCourseFinishedStatements).toHaveBeenCalledWith(courseId);
                });

                describe('and getCourseStartedStatements is failed', function () {
                    beforeEach(function() {
                        getStartedDfr.reject();
                        getFinishedDfr.resolve();
                    });

                    it('should be rejected', function(done) {
                        var promise = provider.getLrsStatements(courseId);

                        promise.fin(function() {
                            expect(promise).toBeRejected();
                            done();
                        });
                    });
                });

                describe('and getCourseFinishedStatements is failed', function () {
                    beforeEach(function () {
                        getStartedDfr.resolve();
                        getFinishedDfr.reject();
                    });

                    it('should be rejected', function (done) {
                        var promise = provider.getLrsStatements(courseId);

                        promise.fin(function () {
                            expect(promise).toBeRejected();
                            done();
                        });
                    });
                });

                describe('and started and finished statements are received', function () {

                    beforeEach(function() {
                        getStartedDfr.resolve(startedStatements);
                        getFinishedDfr.resolve(finishedStatements);
                    });

                    it('should be resolved with started and finished statements', function(done) {
                        var promise = provider.getLrsStatements(courseId);

                        promise.fin(function () {
                            expect(promise).toBeResolvedWith({ started: startedStatements, finished: finishedStatements });
                            done();
                        });
                    });

                });
            });

            describe('when get part', function() {
                it('should get course started statements', function () {
                    provider.getLrsStatements(courseId, 5, 0);

                    expect(xApiProvider.getCourseStartedStatements).toHaveBeenCalledWith(courseId, 5, 0);
                });

                describe('and getCourseStartedStatements is failed', function () {
                    beforeEach(function () {
                        getStartedDfr.reject();
                    });

                    it('should be rejected', function (done) {
                        var promise = provider.getLrsStatements(courseId, 5, 0);

                        promise.fin(function () {
                            expect(promise).toBeRejected();
                            done();
                        });
                    });
                });

                describe('when started statements are received', function() {
                    beforeEach(function() {
                        getStartedDfr.resolve(startedStatements);
                    });

                    it('should get finished statements by started attempts', function(done) {
                        provider.getLrsStatements(courseId, 5, 0);

                        getStartedDfr.promise.fin(function() {
                            expect(xApiProvider.getCourseFinishedStatementsByAttempts).toHaveBeenCalledWith([startedStatements[0].attemptId, startedStatements[1].attemptId]);
                            done();
                        });
                    });

                    describe('and getCourseFinishedStatementsByAttempts is failed', function() {
                        beforeEach(function() {
                            getFinishedByAttemptsDfr.reject();
                        });

                        it('should be rejected', function(done) {
                            var promise = provider.getLrsStatements(courseId, 5, 0);

                            promise.fin(function () {
                                expect(promise).toBeRejected();
                                done();
                            });
                        });
                    });

                    describe('and getCourseFinishedStatementsByAttempts is succed', function () {
                        beforeEach(function() {
                            getFinishedByAttemptsDfr.resolve(finishedStatements);
                        });

                        it('should be resolved with started and finished statements', function (done) {
                            var promise = provider.getLrsStatements(courseId, 5, 0);

                            promise.fin(function () {
                                expect(promise).toBeResolvedWith({ started: startedStatements, finished: finishedStatements });
                                done();
                            });
                        });
                    });
                });

            });
        });
    });
});
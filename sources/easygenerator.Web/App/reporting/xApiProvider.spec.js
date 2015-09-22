define(['reporting/xApiProvider'], function (xApiProvider) {
    "use strict";

    var
        config = require('config'),
        httpRequestSender = require('http/httpRequestSender'),
        constants = require('constants'),
        ReportingStatement = require('models/reporting/statement'),
        filterCriteriaFactory = require('reporting/xApiFilterCriteriaFactory'),
        base64 = require('utils/base64');

    describe('xApiProvider', function () {
        it('should be defined', function () {
            expect(xApiProvider).toBeDefined();
        });

        var courseId = 'courseId',
            learningPathId = 'learningPathId',
            attemptId = 'attemptId',
            parentActivityId = 'parentActivityId',
                dfd,
                filterCriteria;

        var statements = [
            {
                verb: { id: "http://adlnet.gov/expapi/verbs/failed" },
                timestamp: "2014-11-15T07:45:59+00:00",
                actor: { mbox: "mailto:test@example.com", name: "vasyl" },
                stored: "2014-11-15T07:45:59Z",
                result: { score: { scaled: 0.5 } },
                object: {
                    id: "object1id",
                    definition: {
                        name: {
                            "en-US": "title1"
                        }
                    }
                }
            },
             {
                 verb: { id: "http://adlnet.gov/expapi/verbs/passed" },
                 timestamp: "2014-11-15T07:45:59+00:00",
                 actor: { mbox: "mailto:test@example.com", name: "vasyl" },
                 stored: "2014-11-15T07:45:59Z",
                 result: { score: { scaled: 0.5 } },
                 object: {
                     id: "object2id",
                     definition: {
                         name: {
                             "en-US": "title2"
                         }
                     }
                 }
             },
            {
                verb: { id: "http://adlnet.gov/expapi/verbs/launched" },
                timestamp: "2014-11-15T09:54:47.146000+00:00",
                actor: { mbox: "mailto:test@example.com", name: "vasyl" },
                stored: "2014-11-15T07:45:59Z",
                result: { score: { scaled: 0.5 } },
                object: {
                    id: "object3id",
                    definition: {
                        name: {
                            "en-US": "title3"
                        }
                    }
                }
            }
        ];

        beforeEach(function () {
            config.lrs = {
                uri: 'lrsurl',
                authenticationRequired: false,
                credentials: {
                    username: '',
                    password: ''
                },
                version: '1.0.2'
            };

            dfd = Q.defer();
            spyOn(httpRequestSender, 'get').and.returnValue(dfd.promise);
            filterCriteria = {};
            spyOn(filterCriteriaFactory, 'create').and.returnValue(filterCriteria);
            dfd.resolve({ statements: statements });
        });

        describe('getLearningPathCompletedStatements:', function () {

            it('should be function', function () {
                expect(xApiProvider.getLearningPathCompletedStatements).toBeFunction();
            });

            it('should return promise', function () {
                expect(xApiProvider.getLearningPathCompletedStatements(learningPathId)).toBePromise();
            });

            it('should pass correct params to filterCriteriaFactory create function', function () {
                xApiProvider.getLearningPathCompletedStatements(learningPathId, 10, 20);
                expect(filterCriteriaFactory.create).toHaveBeenCalledWith({
                    learningPathId: learningPathId,
                    verbs: [constants.reporting.xApiVerbIds.passed, constants.reporting.xApiVerbIds.failed],
                    limit: 10,
                    skip: 20
                });
            });

            it('should pass filterCriteria to httpRequestSender', function () {
                filterCriteria.learningPathId = learningPathId;
                filterCriteria.limit = 10;
                filterCriteria.skip = 20;

                xApiProvider.getLearningPathCompletedStatements(learningPathId, 10, 20);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[1]).toBe(filterCriteria);
            });

            it('should do request to proper lrs uri', function () {
                xApiProvider.getLearningPathCompletedStatements(learningPathId, 10, 20);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[0]).toBe(config.lrs.uri);
            });

            describe('when lrs doesnt require authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    xApiProvider.getLearningPathCompletedStatements(learningPathId, 10, 20);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBeUndefined();
                });
            });

            describe('when lrs requires authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    config.lrs.authenticationRequired = true;
                    config.lrs.credentials = { username: 'username', password: 'password' };
                    xApiProvider.getLearningPathCompletedStatements(learningPathId, 10, 20);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBe("Basic " + base64.encode(config.lrs.credentials.username + ':' + config.lrs.credentials.password));
                });
            });


            describe('if statements were returned', function () {
                it('should return reporting/statements instances', function (done) {

                    var promise = xApiProvider.getLearningPathCompletedStatements(learningPathId);
                    promise.then(function (result) {
                        expect(result.length).toBe(3);
                        expect(result[0]).toBeInstanceOf(ReportingStatement);
                        expect(result[1]).toBeInstanceOf(ReportingStatement);
                        expect(result[2]).toBeInstanceOf(ReportingStatement);

                        done();
                    });
                });
            });
        });

        describe('getCourseCompletedStatements:', function () {


            it('should be function', function () {
                expect(xApiProvider.getCourseCompletedStatements).toBeFunction();
            });

            it('should return promise', function () {
                expect(xApiProvider.getCourseCompletedStatements(courseId)).toBePromise();
            });

            it('should pass correct params to filterCriteriaFactory create function', function () {
                xApiProvider.getCourseCompletedStatements(courseId, 10, 20);
                expect(filterCriteriaFactory.create).toHaveBeenCalledWith({
                    courseId: courseId,
                    verbs: [constants.reporting.xApiVerbIds.passed, constants.reporting.xApiVerbIds.failed],
                    limit: 10,
                    skip: 20
                });
            });

            it('should pass filterCriteria to httpRequestSender', function () {
                filterCriteria.courseId = courseId;
                filterCriteria.limit = 10;
                filterCriteria.skip = 20;

                xApiProvider.getCourseCompletedStatements(courseId, 10, 20);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[1]).toBe(filterCriteria);
            });

            it('should do request to proper lrs uri', function () {
                xApiProvider.getCourseCompletedStatements(courseId, 10, 20);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[0]).toBe(config.lrs.uri);
            });

            describe('when lrs doesnt require authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    xApiProvider.getCourseCompletedStatements(courseId, 10, 20);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBeUndefined();
                });
            });

            describe('when lrs requires authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    config.lrs.authenticationRequired = true;
                    config.lrs.credentials = { username: 'username', password: 'password' };
                    xApiProvider.getCourseCompletedStatements(courseId, 10, 20);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBe("Basic " + base64.encode(config.lrs.credentials.username + ':' + config.lrs.credentials.password));
                });
            });


            describe('if statements were returned', function () {
                it('should return reporting/statements instances', function (done) {

                    var promise = xApiProvider.getCourseCompletedStatements(courseId);
                    promise.then(function (result) {
                        expect(result.length).toBe(3);
                        expect(result[0]).toBeInstanceOf(ReportingStatement);
                        expect(result[1]).toBeInstanceOf(ReportingStatement);
                        expect(result[2]).toBeInstanceOf(ReportingStatement);

                        done();
                    });
                });
            });
        });

        describe('getMasteredStatements:', function () {

            it('should be function', function () {
                expect(xApiProvider.getMasteredStatements).toBeFunction();
            });

            it('should return promise', function () {
                expect(xApiProvider.getMasteredStatements(attemptId)).toBePromise();
            });

            it('should pass correct params to filterCriteriaFactory create function', function () {
                xApiProvider.getMasteredStatements(attemptId);
                expect(filterCriteriaFactory.create).toHaveBeenCalledWith({
                    attemptId: attemptId,
                    verbs: constants.reporting.xApiVerbIds.mastered
                });
            });

            it('should pass filterCriteria to httpRequestSender', function () {
                filterCriteria.attemptId = attemptId;
                xApiProvider.getMasteredStatements(attemptId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[1]).toBe(filterCriteria);
            });

            it('should do request to proper lrs uri', function () {
                xApiProvider.getMasteredStatements(attemptId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[0]).toBe(config.lrs.uri);
            });

            describe('when lrs doesnt require authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    xApiProvider.getMasteredStatements(attemptId);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBeUndefined();
                });
            });

            describe('when lrs requires authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    config.lrs.authenticationRequired = true;
                    config.lrs.credentials = { username: 'username', password: 'password' };
                    xApiProvider.getMasteredStatements(attemptId);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBe("Basic " + base64.encode(config.lrs.credentials.username + ':' + config.lrs.credentials.password));
                });
            });


            describe('if statements were returned', function () {
                it('should return reporting/statements instances', function (done) {

                    var promise = xApiProvider.getMasteredStatements(courseId);
                    promise.then(function (result) {
                        expect(result.length).toBe(3);
                        expect(result[0]).toBeInstanceOf(ReportingStatement);
                        expect(result[1]).toBeInstanceOf(ReportingStatement);
                        expect(result[2]).toBeInstanceOf(ReportingStatement);

                        done();
                    });
                });
            });
        });

        describe('getStartedStatement:', function () {

            it('should be function', function () {
                expect(xApiProvider.getStartedStatement).toBeFunction();
            });

            it('should return promise', function () {
                expect(xApiProvider.getStartedStatement(attemptId)).toBePromise();
            });

            it('should pass correct params to filterCriteriaFactory create function', function () {
                xApiProvider.getStartedStatement(attemptId);
                expect(filterCriteriaFactory.create).toHaveBeenCalledWith({
                    attemptId: attemptId,
                    verbs: constants.reporting.xApiVerbIds.started
                });
            });

            it('should pass filterCriteria to httpRequestSender', function () {
                filterCriteria.attemptId = attemptId;
                xApiProvider.getStartedStatement(attemptId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[1]).toBe(filterCriteria);
            });

            it('should do request to proper lrs uri', function () {
                xApiProvider.getStartedStatement(attemptId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[0]).toBe(config.lrs.uri);
            });

            describe('when lrs doesnt require authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    xApiProvider.getStartedStatement(attemptId);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBeUndefined();
                });
            });

            describe('when lrs requires authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    config.lrs.authenticationRequired = true;
                    config.lrs.credentials = { username: 'username', password: 'password' };
                    xApiProvider.getStartedStatement(attemptId);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBe("Basic " + base64.encode(config.lrs.credentials.username + ':' + config.lrs.credentials.password));
                });
            });


            describe('if statements were returned', function () {
                it('should return reporting/statements instances', function (done) {

                    var promise = xApiProvider.getStartedStatement(courseId);
                    promise.then(function (result) {
                        expect(result.length).toBe(3);
                        expect(result[0]).toBeInstanceOf(ReportingStatement);
                        expect(result[1]).toBeInstanceOf(ReportingStatement);
                        expect(result[2]).toBeInstanceOf(ReportingStatement);

                        done();
                    });
                });
            });
        });

        describe('getAnsweredStatements:', function () {

            it('should be function', function () {
                expect(xApiProvider.getAnsweredStatements).toBeFunction();
            });

            it('should return promise', function () {
                expect(xApiProvider.getAnsweredStatements(attemptId, parentActivityId)).toBePromise();
            });

            it('should pass correct params to filterCriteriaFactory create function', function () {
                xApiProvider.getAnsweredStatements(attemptId, parentActivityId);
                expect(filterCriteriaFactory.create).toHaveBeenCalledWith({
                    attemptId: attemptId,
                    parentId: parentActivityId,
                    verbs: constants.reporting.xApiVerbIds.answered
                });
            });

            it('should pass filterCriteria to httpRequestSender', function () {
                filterCriteria.attemptId = attemptId;
                xApiProvider.getAnsweredStatements(attemptId, parentActivityId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[1]).toBe(filterCriteria);
            });

            it('should do request to proper lrs uri', function () {
                xApiProvider.getAnsweredStatements(attemptId, parentActivityId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[0]).toBe(config.lrs.uri);
            });

            describe('when lrs doesnt require authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    xApiProvider.getAnsweredStatements(attemptId, parentActivityId);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBeUndefined();
                });
            });

            describe('when lrs requires authentication', function () {
                it('should pass proper httpHeaders to httpRequestSender', function () {
                    config.lrs.authenticationRequired = true;
                    config.lrs.credentials = { username: 'username', password: 'password' };
                    xApiProvider.getAnsweredStatements(attemptId, parentActivityId);
                    var args = httpRequestSender.get.calls.mostRecent().args;
                    expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                    expect(args[2]["Content-Type"]).toBe("application/json");
                    expect(args[2]["Authorization"]).toBe("Basic " + base64.encode(config.lrs.credentials.username + ':' + config.lrs.credentials.password));
                });
            });


            describe('if statements were returned', function () {
                it('should return reporting/statements instances', function (done) {

                    var promise = xApiProvider.getAnsweredStatements(courseId);
                    promise.then(function (result) {
                        expect(result.length).toBe(3);
                        expect(result[0]).toBeInstanceOf(ReportingStatement);
                        expect(result[1]).toBeInstanceOf(ReportingStatement);
                        expect(result[2]).toBeInstanceOf(ReportingStatement);

                        done();
                    });
                });
            });
        });

    });
});

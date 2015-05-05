define(['reporting/xApiProvider'], function (xApiProvider) {
    "use strict";

    var
        config = require('config'),
        httpRequestSender = require('http/httpRequestSender'),
        constants = require('constants'),
        ReportingStatement = require('models/reporting/statement');

    describe('xApiProvider', function () {

        it('should be defined', function () {
            expect(xApiProvider).toBeDefined();
        });

        describe('getCourseCompletedStatements:', function () {
            var courseId = 'courseId',
                dfd;
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

                dfd.resolve({ statements: statements });
            });

            it('should be function', function () {
                expect(xApiProvider.getCourseCompletedStatements).toBeFunction();
            });

            it('should return promise', function () {
                expect(xApiProvider.getCourseCompletedStatements(courseId)).toBePromise();
            });

            it('should call httpRequestSender send method with correct params', function () {
                xApiProvider.getCourseCompletedStatements(courseId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[0]).toBe(config.lrs.uri);
                expect(args[1][constants.reporting.filterKeys.courseId]).toBe(courseId);
                expect(args[1]['v']).toBeDefined();
                expect(args[1][constants.reporting.filterKeys.verb]).toBe([constants.reporting.xApiVerbIds.passed, constants.reporting.xApiVerbIds.failed].join(","));
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
            });

            it('should pass correct skip and take params if present to httpRequestSender', function () {
                var skip = 10, take = 20;
                xApiProvider.getCourseCompletedStatements(courseId, take, skip);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[1][constants.reporting.filterKeys.limit]).toBe(take);
                expect(args[1][constants.reporting.filterKeys.skip]).toBe(skip);
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
    });
});

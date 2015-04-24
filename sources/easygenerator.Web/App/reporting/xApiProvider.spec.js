define(['reporting/xApiProvider'], function (xApiProvider) {
    "use strict";

    var
        config = require('config'),
        httpRequestSender = require('http/httpRequestSender'),
        constants = require('constants'),
        ReportingStatement = require('models/reportingStatement');

    describe('xApiProvider', function () {

        it('should be defined', function () {
            expect(xApiProvider).toBeDefined();
        });

        describe('getReportingStatements:', function () {
            var courseId = 'courseId',
                dfd;
            var statements = [
                {
                    "verb": { "id": "http://adlnet.gov/expapi/verbs/failed" },
                    "timestamp": "2014-11-15T07:45:59+00:00",
                    "actor": { "mbox": "mailto:test@example.com", "name": "vasyl" },
                    "stored": "2014-11-15T07:45:59Z",
                    "result": { "score": { "scaled": 0.5 } }
                },
                 {
                     "verb": { "id": "http://adlnet.gov/expapi/verbs/passed" },
                     "timestamp": "2014-11-15T07:45:59+00:00",
                     "actor": { "mbox": "mailto:test@example.com", "name": "vasyl" },
                     "stored": "2014-11-15T07:45:59Z",
                     "result": { "score": { "scaled": 0.5 } }
                 },
                {
                    "verb": { "id": "http://adlnet.gov/expapi/verbs/launched" },
                    "timestamp": "2014-11-15T09:54:47.146000+00:00",
                    "actor": { "mbox": "mailto:aa@aa.aa", "name": "vas" },
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
                expect(xApiProvider.getReportingStatements).toBeFunction();
            });

            it('should return promise', function () {
                expect(xApiProvider.getReportingStatements(courseId)).toBePromise();
            });

            it('should call httpRequestSender send method with correct params', function () {

                xApiProvider.getReportingStatements(courseId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[0]).toBe(config.lrs.uri);
                expect(args[1][constants.reporting.extensionKeys.courseId]).toBe(courseId);
                expect(args[1]['v']).toBeDefined();
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
            });

            describe('if statements were returned', function () {
                it('should return only reportingStatements with failed and passed verbs', function (done) {

                    var promise = xApiProvider.getReportingStatements(courseId);

                    promise.then(function (result) {
                        expect(result.length).toBe(2);
                        expect(result[0]).toBeInstanceOf(ReportingStatement);
                        expect(result[1]).toBeInstanceOf(ReportingStatement);

                        expect(result[0].correct).toBeFalsy();
                        expect(result[1].correct).toBeTruthy();

                        done();
                    });
                });
            });
        });
    });
});

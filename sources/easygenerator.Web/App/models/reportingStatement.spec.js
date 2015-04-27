define(['models/reportingStatement'], function (ReportingStatement) {
    "use strict";

    var
        constants = require('constants')
    ;

    describe('model [reportingStatement]', function () {

        it('should be constructor function', function () {
            expect(ReportingStatement).toBeFunction();
        });

        describe('when specification is not an object', function () {

            it('should throw exception', function () {
                var f = function () {
                    new ReportingStatement();
                };
                expect(f).toThrow();
            });

        });

        describe('constructor:', function () {
            var passedSpec, failedSpec;
            beforeEach(function () {
                passedSpec = {
                    timestamp: "2013-12-27T07:58:07.617000+00:00",
                    actor: {
                        name: "Username",
                        mbox: "mailto:email@example.com"
                    },
                    verb: {
                        id: constants.reporting.xApiVerbIds.passed
                    },
                    result: {
                        score: {
                            "scaled": 0.5
                        }
                    }
                },
                failedSpec = {
                    timestamp: "2013-12-27T07:58:07.617000+00:00",
                    actor: {
                        name: "Username",
                        mbox: "mailto:email@example.com"
                    },
                    verb: {
                        id: constants.reporting.xApiVerbIds.failed
                    },
                    result: {
                        score: {
                            "scaled": 0.5
                        }
                    }
                }
            });

            it('should fill model with correct date, name and email', function () {
                var reportingStatement = new ReportingStatement(passedSpec);

                expect(reportingStatement.date).toEqual(new Date(passedSpec.timestamp));
                expect(reportingStatement.name).toEqual(passedSpec.actor.name);
                expect(reportingStatement.email).toEqual(passedSpec.actor.mbox.replace('mailto:', ''));
            });

            it('should set correct field to true if spec.verb.id is passed verb id', function () {
                var reportingStatement = new ReportingStatement(passedSpec);
                expect(reportingStatement.correct).toBeTruthy();
            });

            it('should set correct field to false if spec.verb.id is failed verb id', function () {
                var reportingStatement = new ReportingStatement(failedSpec);
                expect(reportingStatement.correct).toBeFalsy();
            });

            it('should set score to spec.result.score.scaled multiplied by 100', function () {
                var reportingStatement = new ReportingStatement(passedSpec);
                expect(reportingStatement.score).toBe(50);
            });
        });
    });
});
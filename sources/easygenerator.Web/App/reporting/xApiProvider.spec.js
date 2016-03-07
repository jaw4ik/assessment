import XApiProvider from './xApiProvider';

import FilterCriteriaFactory from './xApiFilterCriteriaFactory';
import config from 'config';
import Statement from 'models/reporting/statement';
import httpRequestSender from 'http/httpRequestSender';
import base64 from 'utils/base64';
import constants from 'constants';

describe('XApiProvider', () => {

    it('should be defined', () => {
        expect(XApiProvider).toBeDefined();
    });

    var courseId = 'courseId',
        learningPathId = 'learningPathId',
        attemptId = 'attemptId',
        parentActivityId = 'parentActivityId',
        filterCriteria = {},
        dfd;

    var rootStatements = [
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
            },
            context: {
                registration: '223'
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
            },
            context: {
                registration: '223'
            }
        }
    ];

    var embededStatements = [{
        mastered: {
            verb: { id: "http://adlnet.gov/expapi/verbs/mastered" },
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
            },
            context: {
                registration: '223'
            }
        },
        answered: [
            {
                verb: { id: "http://adlnet.gov/expapi/verbs/answered" },
                timestamp: "2014-11-15T07:45:59+00:00",
                actor: { mbox: "mailto:test@example.com", name: "vasyl" },
                stored: "2014-11-15T07:45:59Z",
                result: { score: { scaled: 1 } },
                object: {
                    id: "object1id",
                    definition: {
                        name: {
                            "en-US": "title1"
                        }
                    }
                },
                context: {
                    registration: '223'
                }
            }
        ],
        experienced: []
    }];

    beforeEach(() => {
        config.lrs = {
            uri: 'lrsurl',
            statementsPath: '/statements',
            resultsPath: '/results',
            authenticationRequired: false,
            credentials: {
                username: '',
                password: ''
            },
            version: '1.0.2'
        };

        dfd = Q.defer();

        spyOn(httpRequestSender, 'get').and.returnValue(dfd.promise);
        spyOn(FilterCriteriaFactory, 'create').and.returnValue(filterCriteria);
    });

    describe('getCourseStatements:', () => {

        it('should be method of XApiProvider', () => {
            expect(XApiProvider.getCourseStatements).toBeFunction();
        });

        it('should return promise', () => {
            expect(XApiProvider.getCourseStatements(courseId)).toBePromise();
        });

        it('should pass correct params to FilterCriteriaFactory create method', () => {
            XApiProvider.getCourseStatements(courseId, false, 10, 20);
            expect(FilterCriteriaFactory.create).toHaveBeenCalledWith({ courseId: courseId, embeded: false, limit: 10, skip: 20 });
        });

        it('should pass filterCriteria to httpRequestSender', () => {
            filterCriteria.courseId = courseId;
            filterCriteria.embeded = false;
            filterCriteria.limit = 10;
            filterCriteria.skip = 20;

            XApiProvider.getCourseStatements(courseId, false, 10, 20);
            var args = httpRequestSender.get.calls.mostRecent().args;
            expect(args[1]).toBe(filterCriteria);
        });

        it('should do request to proper lrs uri', () => {
            XApiProvider.getCourseStatements(courseId, false, 10, 20);
            var args = httpRequestSender.get.calls.mostRecent().args;
            expect(args[0]).toBe(config.lrs.uri + config.lrs.resultsPath);
        });

        describe('when lrs does not require authentication', () => {

            it('should pass proper httpHeaders to httpRequestSender', () => {
                XApiProvider.getCourseStatements(courseId, false, 10, 20);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
                expect(args[2]["Authorization"]).toBeUndefined();
            });

        });

        describe('when lrs requires authentication', () => {

            beforeEach(() => {
                config.lrs.authenticationRequired = true;
                config.lrs.credentials = { username: 'username', password: 'password' };
            });

            it('should pass proper httpHeaders to httpRequestSender', () => {
                XApiProvider.getCourseStatements(courseId, false, 10, 20);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
                expect(args[2]["Authorization"]).toBe(`Basic ${base64.encode(config.lrs.credentials.username)}:${config.lrs.credentials.password}`);
            });

        });

        describe('when response were returned', () => {

            describe('and response is not defined or response statements are not defined', () => {

                beforeEach(() => {
                    dfd.resolve({});
                });

                it('should return null', done => (async () => {
                    var statements = await XApiProvider.getCourseStatements(courseId, false, 10, 20);
                    expect(statements).toBeNull();
                })().then(done));

            });

            describe('and response contains statements', () => {

                describe('and statements are not detailed', () => {

                    beforeEach(() => {
                        dfd.resolve({
                            statements: [
                                {
                                    root: [
                                        rootStatements[0],
                                        rootStatements[2]
                                    ]
                                },
                                {
                                    root: [
                                        rootStatements[1]
                                    ]
                                }
                            ]
                        });
                    });

                    it('should return all statements mapped as Statement instances', done => (async () => {
                        var statements = await XApiProvider.getCourseStatements(courseId, false, 10, 20);
                        expect(statements.length).toBe(2);
                        expect(statements[0].root[0]).toBeInstanceOf(Statement);
                        expect(statements[0].root[1]).toBeInstanceOf(Statement);
                        expect(statements[1].root[0]).toBeInstanceOf(Statement);
                    })().then(done));

                });

                describe('and statements are detailed', () => {

                    beforeEach(() => {
                        dfd.resolve({
                            statements: [
                                {
                                    root: [
                                        rootStatements[0],
                                        rootStatements[2]
                                    ],
                                    embeded: [
                                        {
                                            mastered: embededStatements[0].mastered,
                                            answered: embededStatements[0].answered,
                                            experienced: embededStatements[0].experienced
                                        }
                                    ]
                                },
                                {
                                    root: [
                                        rootStatements[1]
                                    ]
                                }
                            ]
                        });
                    });

                    it('should return all statements mapped as Statement instances', done => (async () => {
                        var statements = await XApiProvider.getCourseStatements(courseId, true, 10, 20);
                        expect(statements.length).toBe(2);
                        expect(statements[0].root[0]).toBeInstanceOf(Statement);
                        expect(statements[0].root[1]).toBeInstanceOf(Statement);
                        expect(statements[1].root[0]).toBeInstanceOf(Statement);
                        expect(statements[0].embeded[0].mastered).toBeInstanceOf(Statement);
                        expect(statements[0].embeded[0].answered[0]).toBeInstanceOf(Statement);
                    })().then(done));

                });

            });

        });

    });

    describe('getLearningPathFinishedStatements:', () => {

        it('should be method of XApiProvider', () => {
            expect(XApiProvider.getLearningPathFinishedStatements).toBeFunction();
        });

        it('should return promise', () => {
            expect(XApiProvider.getLearningPathFinishedStatements(learningPathId)).toBePromise();
        });

        it('should pass correct params to FilterCriteriaFactory create method', () => {
            XApiProvider.getLearningPathFinishedStatements(learningPathId, 10, 20);
            expect(FilterCriteriaFactory.create).toHaveBeenCalledWith({ 
                learningPathId: learningPathId,
                verbs: [constants.reporting.xApiVerbIds.passed, constants.reporting.xApiVerbIds.failed],
                limit: 10,
                skip: 20
            });
        });

        it('should pass filterCriteria to httpRequestSender', () => {
            filterCriteria.learningPathId = learningPathId;
            filterCriteria.limit = 10;
            filterCriteria.skip = 20;

            XApiProvider.getLearningPathFinishedStatements(learningPathId, 10, 20);
            var args = httpRequestSender.get.calls.mostRecent().args;
            expect(args[1]).toBe(filterCriteria);
        });

        it('should do request to proper lrs uri', () => {
            XApiProvider.getLearningPathFinishedStatements(learningPathId, 10, 20);
            var args = httpRequestSender.get.calls.mostRecent().args;
            expect(args[0]).toBe(config.lrs.uri + config.lrs.statementsPath);
        });

        describe('when lrs does not require authentication', () => {

            it('should pass proper httpHeaders to httpRequestSender', () => {
                XApiProvider.getLearningPathFinishedStatements(learningPathId, 10, 20);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
                expect(args[2]["Authorization"]).toBeUndefined();
            });

        });

        describe('when lrs requires authentication', () => {

            beforeEach(() => {
                config.lrs.authenticationRequired = true;
                config.lrs.credentials = { username: 'username', password: 'password' };
            });

            it('should pass proper httpHeaders to httpRequestSender', () => {
                XApiProvider.getLearningPathFinishedStatements(learningPathId, 10, 20);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
                expect(args[2]["Authorization"]).toBe(`Basic ${base64.encode(config.lrs.credentials.username)}:${config.lrs.credentials.password}`);
            });

        });

        describe('when response were returned', () => {

            describe('and response is not defined or response statements are not defined', () => {

                beforeEach(() => {
                    dfd.resolve({});
                });

                it('should return null', done => (async () => {
                    var statements = await XApiProvider.getLearningPathFinishedStatements(learningPathId, 10, 20);
                    expect(statements).toBeNull();
                })().then(done));

            });

            describe('and response contains statements', () => {
               
                beforeEach(() => {
                    dfd.resolve({
                        statements: [
                            rootStatements[0], rootStatements[1]
                        ]
                    });
                });

                it('should return all statements mapped as Statement instances', done => (async () => {
                    var statements = await XApiProvider.getLearningPathFinishedStatements(learningPathId, 10, 20);
                    expect(statements.length).toBe(2);
                    expect(statements[0]).toBeInstanceOf(Statement);
                    expect(statements[1]).toBeInstanceOf(Statement);
                })().then(done));

            });

        });

    });

    describe('getMasteredStatements:', () => {

        it('should be method of XApiProvider', () => {
            expect(XApiProvider.getMasteredStatements).toBeFunction();
        });

        it('should return promise', () => {
            expect(XApiProvider.getMasteredStatements(attemptId)).toBePromise();
        });

        it('should pass correct params to FilterCriteriaFactory create method', () => {
            XApiProvider.getMasteredStatements(attemptId);
            expect(FilterCriteriaFactory.create).toHaveBeenCalledWith({ 
                attemptIds: attemptId,
                verbs: constants.reporting.xApiVerbIds.mastered
            });
        });

        it('should pass filterCriteria to httpRequestSender', () => {
            filterCriteria.attemptIds = attemptId;
            
            XApiProvider.getMasteredStatements(attemptId);
            var args = httpRequestSender.get.calls.mostRecent().args;
            expect(args[1]).toBe(filterCriteria);
        });

        it('should do request to proper lrs uri', () => {
            XApiProvider.getMasteredStatements(attemptId);
            var args = httpRequestSender.get.calls.mostRecent().args;
            expect(args[0]).toBe(config.lrs.uri + config.lrs.statementsPath);
        });

        describe('when lrs does not require authentication', () => {

            it('should pass proper httpHeaders to httpRequestSender', () => {
                XApiProvider.getMasteredStatements(attemptId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
                expect(args[2]["Authorization"]).toBeUndefined();
            });

        });

        describe('when lrs requires authentication', () => {

            beforeEach(() => {
                config.lrs.authenticationRequired = true;
                config.lrs.credentials = { username: 'username', password: 'password' };
            });

            it('should pass proper httpHeaders to httpRequestSender', () => {
                XApiProvider.getMasteredStatements(attemptId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
                expect(args[2]["Authorization"]).toBe(`Basic ${base64.encode(config.lrs.credentials.username)}:${config.lrs.credentials.password}`);
            });

        });

        describe('when response were returned', () => {

            describe('and response is not defined or response statements are not defined', () => {

                beforeEach(() => {
                    dfd.resolve({});
                });

                it('should return null', done => (async () => {
                    var statements = await XApiProvider.getMasteredStatements(attemptId);
                    expect(statements).toBeNull();
                })().then(done));

            });

            describe('and response contains statements', () => {
               
                beforeEach(() => {
                    dfd.resolve({
                        statements: [
                            embededStatements[0].mastered
                        ]
                    });
                });

                it('should return all statements mapped as Statement instances', done => (async () => {
                    var statements = await XApiProvider.getMasteredStatements(attemptId);
                    expect(statements.length).toBe(1);
                    expect(statements[0]).toBeInstanceOf(Statement);
                })().then(done));

            });

        });

    });

    describe('getObjectiveStatements:', () => {

        it('should be method of XApiProvider', () => {
            expect(XApiProvider.getObjectiveStatements).toBeFunction();
        });

        it('should return promise', () => {
            expect(XApiProvider.getObjectiveStatements(attemptId, parentActivityId)).toBePromise();
        });

        it('should pass correct params to FilterCriteriaFactory create method', () => {
            XApiProvider.getObjectiveStatements(attemptId, parentActivityId);
            expect(FilterCriteriaFactory.create).toHaveBeenCalledWith({ 
                attemptIds: attemptId,
                parentId: parentActivityId,
                verbs: [ constants.reporting.xApiVerbIds.answered, constants.reporting.xApiVerbIds.experienced ]
            });
        });

        it('should pass filterCriteria to httpRequestSender', () => {
            filterCriteria.attemptIds = attemptId;

            XApiProvider.getObjectiveStatements(attemptId, parentActivityId);
            var args = httpRequestSender.get.calls.mostRecent().args;
            expect(args[1]).toBe(filterCriteria);
        });

        it('should do request to proper lrs uri', () => {
            XApiProvider.getObjectiveStatements(attemptId, parentActivityId);
            var args = httpRequestSender.get.calls.mostRecent().args;
            expect(args[0]).toBe(config.lrs.uri + config.lrs.statementsPath);
        });

        describe('when lrs does not require authentication', () => {

            it('should pass proper httpHeaders to httpRequestSender', () => {
                XApiProvider.getObjectiveStatements(attemptId, parentActivityId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
                expect(args[2]["Authorization"]).toBeUndefined();
            });

        });

        describe('when lrs requires authentication', () => {

            beforeEach(() => {
                config.lrs.authenticationRequired = true;
                config.lrs.credentials = { username: 'username', password: 'password' };
            });

            it('should pass proper httpHeaders to httpRequestSender', () => {
                XApiProvider.getObjectiveStatements(attemptId, parentActivityId);
                var args = httpRequestSender.get.calls.mostRecent().args;
                expect(args[2]["X-Experience-API-Version"]).toBe(config.lrs.version);
                expect(args[2]["Content-Type"]).toBe("application/json");
                expect(args[2]["Authorization"]).toBe(`Basic ${base64.encode(config.lrs.credentials.username)}:${config.lrs.credentials.password}`);
            });

        });

        describe('when response were returned', () => {

            describe('and response is not defined or response statements are not defined', () => {

                beforeEach(() => {
                    dfd.resolve({});
                });

                it('should return null', done => (async () => {
                    var statements = await XApiProvider.getObjectiveStatements(attemptId, parentActivityId);
                    expect(statements).toBeNull();
                })().then(done));

            });

            describe('and response contains statements', () => {
               
                beforeEach(() => {
                    dfd.resolve({
                        statements: [
                            embededStatements[0].answered[0]
                        ]
                    });
                });

                it('should return all statements mapped as Statement instances', done => (async () => {
                    var statements = await XApiProvider.getObjectiveStatements(attemptId, parentActivityId);
                    expect(statements.length).toBe(1);
                    expect(statements[0]).toBeInstanceOf(Statement);
                })().then(done));

            });

        });

    });

});

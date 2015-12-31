import CourseStatementsProvider from 'reporting/courseStatementsProvider';
import constants from 'constants';
import XApiProvider from 'reporting/xApiProvider';
import StartedStatement from 'reporting/viewmodels/startedStatement';
import FinishStatement from 'reporting/viewmodels/finishStatement';
import ObjectiveStatement from 'reporting/viewmodels/objectiveStatement';
import QuestionStatement from 'reporting/viewmodels/questionStatement';

describe('CourseStatementsProvider:', () => {

    it('should be defined', () => {
        expect(CourseStatementsProvider).toBeDefined();
    });

    describe('getLrsStatements:', () => {

        var entityId = 'entityId',
            dfd;

        var statements = [
            {
                root: [
                    {
                        id: '1',
                        attemptId: '123',
                        actor: {
                            name: 'roma',
                            email: 'r@p.com'
                        },
                        score: null,
                        verb: constants.reporting.xApiVerbIds.started

                    },
                    {
                        id: '2',
                        attemptId: '123',
                        actor: {
                            name: 'roma',
                            email: 'r@p.com'
                        },
                        score: null,
                        verb: constants.reporting.xApiVerbIds.passed
                    }
                ]
            },
            {
                root: [
                    {
                        id: '3',
                        attemptId: '1234',
                        actor: {
                            name: 'roma',
                            email: 'r@p.com'
                        },
                        score: null,
                        verb: constants.reporting.xApiVerbIds.passed
                    }
                ]
            },
            {
                root: [
                    {
                        id: '4',
                        attemptId: '1235',
                        actor: {
                            name: 'roma',
                            email: 'r@p.com'
                        },
                        score: null,
                        verb: constants.reporting.xApiVerbIds.started

                    }
                ]
            }
        ];

        var detailedStatements = [
            {
                root: [
                    {
                        id: '1',
                        attemptId: '123',
                        actor: {
                            name: 'roma',
                            email: 'r@p.com'
                        },
                        score: null,
                        verb: constants.reporting.xApiVerbIds.started

                    },
                    {
                        id: '2',
                        attemptId: '123',
                        actor: {
                            name: 'roma',
                            email: 'r@p.com'
                        },
                        score: null,
                        verb: constants.reporting.xApiVerbIds.passed
                    }
                ], 
                embeded: [
                    {
                        mastered: {
                            id: '11',
                            attemptId: '123',
                            actor: {
                                name: 'roma',
                                email: 'r@p.com'
                            },
                            score: null,
                            verb: constants.reporting.xApiVerbIds.mastered
                        },
                        answered: [
                            {
                                id: '1145',
                                attemptId: '123',
                                actor: {
                                    name: 'roma',
                                    email: 'r@p.com'
                                },
                                score: null,
                                response: null,
                                verb: constants.reporting.xApiVerbIds.mastered
                            },
                            {
                                id: '11456',
                                attemptId: '123',
                                actor: {
                                    name: 'roma',
                                    email: 'r@p.com'
                                },
                                score: null,
                                response: null,
                                verb: constants.reporting.xApiVerbIds.mastered
                            }
                        ]
                    },
                    {
                        mastered: {
                            id: '112',
                            attemptId: '123',
                            actor: {
                                name: 'roma',
                                email: 'r@p.com'
                            },
                            score: null,
                            verb: constants.reporting.xApiVerbIds.mastered
                        }
                    }
                ]
            }
        ];

        beforeEach(() => {
            dfd = Q.defer();
            spyOn(XApiProvider, 'getCourseStatements').and.returnValue(dfd.promise);
        });

        it('should be method of CourseStatementsProvider', () => {
            expect(CourseStatementsProvider.getLrsStatements).toBeFunction();
        });

        it('should return promise', () => {
            expect(CourseStatementsProvider.getLrsStatements({ entityId: entityId, take: 10, skip: 20 })).toBePromise();
        });

        it('should call XApiProvider getCourseStatements with correct args', () => {
            CourseStatementsProvider.getLrsStatements({ entityId: entityId, take: 10, skip: 20 });
            expect(XApiProvider.getCourseStatements).toHaveBeenCalledWith(entityId, undefined, 10, 20);
        });

        describe('when statements are returned successfully', () => {

            describe('and statements are not embeded', () => {

                beforeEach(() => {
                    dfd.resolve(statements);
                });

                it('should return mapped instances of statement viewmodels', done => (async () => {
                    var reportingStatements = await CourseStatementsProvider.getLrsStatements({ entityId: entityId, take: 10, skip: 20 });
                    expect(reportingStatements.length).toBe(3);
                    expect(reportingStatements[0]).toBeInstanceOf(FinishStatement);
                    expect(reportingStatements[0].startedLrsStatement).toBe(statements[0].root[0]);
                    expect(reportingStatements[1]).toBeInstanceOf(FinishStatement);
                    expect(reportingStatements[1].startedLrsStatement).toBe(null);
                    expect(reportingStatements[2]).toBeInstanceOf(StartedStatement);
                })().then(done));

            });

            describe('and statements are embeded', () => {

                beforeEach(() => {
                    dfd.resolve(detailedStatements);
                });

                it('should return mapped instances of statement viewmodels', done => (async () => {
                    var reportingStatements = await CourseStatementsProvider.getLrsStatements({ entityId: entityId, embeded: true, take: 10, skip: 20 });
                    expect(reportingStatements.length).toBe(1);
                    expect(reportingStatements[0]).toBeInstanceOf(FinishStatement);
                    expect(reportingStatements[0].startedLrsStatement).toBe(detailedStatements[0].root[0]);
                    expect(reportingStatements[0].children().length).toBe(2);
                    expect(reportingStatements[0].children()[0]).toBeInstanceOf(ObjectiveStatement);
                    expect(reportingStatements[0].children()[0].children().length).toBe(2);
                    expect(reportingStatements[0].children()[0].children()[0]).toBeInstanceOf(QuestionStatement);
                    expect(reportingStatements[0].children()[0].children()[1]).toBeInstanceOf(QuestionStatement);
                    expect(reportingStatements[0].children()[1]).toBeInstanceOf(ObjectiveStatement);
                })().then(done));

            });

        });

    });

});
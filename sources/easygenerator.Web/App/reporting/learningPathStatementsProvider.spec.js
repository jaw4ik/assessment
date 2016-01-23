import LearningPathStatementsProvider from 'reporting/learningPathStatementsProvider';
import XApiProvider from 'reporting/xApiProvider';
import FinishStatement from 'reporting/viewmodels/finishStatement';

var learningPathId = 'learningPathId';

describe('learningPathStatementsProvider:', () => {

    it('should be defined', () => {
        expect(LearningPathStatementsProvider).toBeDefined();
    });

    describe('getLrsStatements:', () => {
        var defer,
            statements = [
                {
                    id: '1',
                    actor: {
                        name: 'roma',
                        email: 'r@p.com'
                    },
                    score: null,
                    verb: 'http://adlnet.gov/expapi/verbs/passed'
                },
                {
                    id: '2',
                    actor: {
                        name: 'roma',
                        email: 'r@p.com'
                    },
                    score: null,
                    verb: 'http://adlnet.gov/expapi/verbs/failed'
                }
            ];

        beforeEach(() => {
            defer = Q.defer();
            spyOn(XApiProvider, 'getLearningPathFinishedStatements').and.returnValue(defer.promise);
        });

        it('should be method of LearningPathStatementsProvider', () => {
            expect(LearningPathStatementsProvider.getLrsStatements).toBeFunction();
        });

        it('should return promise', () => {
            expect(LearningPathStatementsProvider.getLrsStatements({ entityId: learningPathId, take: 10, skip: 20 })).toBePromise();
        });

        it('should get learning path finished statements', () => {
            LearningPathStatementsProvider.getLrsStatements({ entityId: learningPathId, take: 10, skip: 20 });
            expect(XApiProvider.getLearningPathFinishedStatements).toHaveBeenCalledWith(learningPathId, 10, 20);
        });

        describe('when statements are returned successfully', () => {

            beforeEach(() => {
                defer.resolve(statements);
            });

            it('should return mapped instances of statement viewmodels', done => (async () => {
                var reportingStatements = await LearningPathStatementsProvider.getLrsStatements({ entityId: learningPathId, take: 10, skip: 20 });
                expect(reportingStatements.length).toBe(2);
                expect(reportingStatements[0]).toBeInstanceOf(FinishStatement);
                expect(reportingStatements[1]).toBeInstanceOf(FinishStatement);
            })().then(done));

        });

    });

});
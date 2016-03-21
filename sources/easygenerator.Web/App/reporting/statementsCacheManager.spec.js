import statementsCacheManager from 'reporting/statementsCacheManager';

import ko from 'knockout';
import _ from 'underscore';

describe('statementsCacheManager:', () => {

    it('should be defined', () => {
        expect(statementsCacheManager).toBeDefined();
    });

    describe('applyLoadedChanges:', () => {

        it('should be function', () => {
            expect(statementsCacheManager.applyLoadedChanges).toBeFunction();
        });

        it('should apply loaded changes', () => {
            var viewStatements = [
                {
                    isExpandable: true,
                    children: ko.observableArray([]),
                    lrsStatement: {
                        attemptId: '123',
                        date: new Date(Date.now())
                    }
                }
            ];
            var loadedResults = [
                {
                    isExpandable: true,
                    children: ko.observableArray([
                        [{
                            children: ko.observable([
                            {
                                lrsStatement: {
                                    date: new Date(Date.now() - 1000000),
                                    id: '124'
                                }
                            }
                            ]),
                            lrsStatement: {
                                date: new Date(Date.now() - 100000),
                                id: '125'
                            }
                        }], 
                        [{
                            children: ko.observable([
                                {
                                    lrsStatement: {
                                        date: new Date(Date.now() - 2000000)
                                    }
                                }
                            ]),
                            lrsStatement: {
                                date: new Date(Date.now() - 200000)
                            }
                        }]
                    ]),
                    lrsStatement: {
                        attemptId: '123'
                    }
                }
            ];

            statementsCacheManager.applyLoadedChanges(viewStatements, loadedResults);

            expect(viewStatements[0].children().length).toBe(2);
            expect(viewStatements[0].children()[0].lrsStatement.id).toBe('125');
            expect(viewStatements[0].children()[0].children().length).toBe(1);
            expect(viewStatements[0].children()[0].children()[0].lrsStatement.id).toBe('124');
        });

    });

    describe('clearProgressedHistory:', () => {

        it('should be function', () => {
            expect(statementsCacheManager.clearProgressedHistory).toBeFunction();
        });

        it('should clear progressed history', () => {
            var statements = [
                {
                    children: ko.observableArray([
                        [
                            { id : 1 },
                            { id: 2 }
                        ]
                    ])
                },
                {
                    children: ko.observableArray([
                        [
                            { id : 3 },
                            { id: 4 }
                        ]
                    ])
                }
            ];

            statementsCacheManager.clearProgressedHistory(statements);

            expect(statements.length).toBe(2);
            expect(statements[0].children().length).toBe(1);
            expect(statements[0].children()[0].id).toBe(1);
            expect(statements[1].children().length).toBe(1);
            expect(statements[1].children()[0].id).toBe(3);
        });

    });

});


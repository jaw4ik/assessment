define(['reporting/viewmodels/expandableStatement'], function (ExpandableStatement) {
    "use strict";

    describe('viewmodel [ExpandableStatement]', function () {
        var lrsStatement,
            expandAction,
            statement;

        beforeEach(function () {
            lrsStatement = { attemptId: 'attemptId' };
            expandAction = function () { };
            statement = new ExpandableStatement(lrsStatement, expandAction);
        });

        it('should be constructor function', function () {
            expect(ExpandableStatement).toBeFunction();
        });

        describe('[ctor]', function () {
            it('should initialize fields with proper values', function () {
                var statement = new ExpandableStatement(lrsStatement, expandAction);

                expect(statement.lrsStatement).toBe(lrsStatement);
                expect(statement.isExpanded).toBeObservable();
                expect(statement.isExpanded()).toBeFalsy();
                expect(statement.children).toBeObservableArray();
                expect(statement.children().length).toBe(0);
                expect(statement.expandLoadAction).toBe(expandAction);
            });

            describe('when lrsStatement contains attemptId', function () {
                it('it should set isExpandable to true', function () {
                    expect(statement.isExpandable).toBeTruthy();
                });
            });

            describe('when lrsStatement doesnt contain attemptId', function () {
                it('it should set isExpandable to false', function () {
                    lrsStatement.attemptId = null;
                    statement = new ExpandableStatement(lrsStatement, expandAction);
                    expect(statement.isExpandable).toBeFalsy();
                });
            });
        });

        describe('[collapse]', function () {
            it('should be function', function () {
                expect(statement.collapse).toBeFunction();
            });

            it('should set isExpanded to false', function () {
                statement.isExpanded(true);
                statement.collapse();
                expect(statement.isExpanded()).toBeFalsy();
            });
        });

        describe('[expand]', function () {

            it('should be function', function () {
                expect(statement.expand).toBeFunction();
            });

            it('should return promise', function () {
                expect(statement.expand()).toBePromise();
            });

            describe('when isExpandable is false', function () {
                it('promise should return undefined', function (done) {
                    lrsStatement.attemptId = null;
                    statement = new ExpandableStatement(lrsStatement, expandAction);
                    statement.expand().then(function (result) {
                        expect(result).toBeUndefined();
                        done();
                    });
                });
            });

            describe('when isExpandable is true', function () {
                describe('when children is null', function () {
                    it('should set isExpanded to true and return undefined', function () {
                        statement.children = null;
                        statement.expand().then(function (result) {
                            expect(statement.isExpanded()).toBeTruthy();
                            expect(result).toBeUndefined();
                            done();
                        });
                    });
                });

                describe('when children length is 0', function () {
                    it('should set isExpanded to true', function () {
                        statement.children = [];
                        statement.expand().then(function (result) {
                            expect(statement.isExpanded()).toBeTruthy();
                            expect(result).toBeUndefined();
                            done();
                        });
                    });
                });

                describe('when children is not empty', function () {
                    it('should return expandLoadAction', function () {
                        statement.children = [{}];
                        statement.expand().then(function (result) {
                            expect(result).toBe(expandAction);
                            done();
                        });
                    });
                });
            });
        });
    });
});
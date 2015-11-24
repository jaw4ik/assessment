import co from 'co';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import userContext from 'userContext';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import constants from 'constants';

describe('viewmodel [ExpandableStatement]', () => {
    var lrsStatement,
        statement;

    beforeEach(() => {
        lrsStatement = { attemptId: 'attemptId' };
        statement = new ExpandableStatement(lrsStatement);
    });

    it('should be class', () => {
        expect(ExpandableStatement).toBeFunction();
    });

    describe('[ctor]', () => {
        it('should initialize fields with proper values', () => {
            expect(statement.lrsStatement).toBe(lrsStatement);
            expect(statement.isExpanded).toBeObservable();
            expect(statement.isExpanded()).toBeFalsy();
            expect(statement.children).toBeObservableArray();
            expect(statement.children().length).toBe(0);
        });

        describe('when lrsStatement contains attemptId', () => {
            it('it should set isExpandable to true', () => {
                expect(statement.isExpandable).toBeTruthy();
            });
        });

        describe('when lrsStatement doesnt contain attemptId', () => {
            it('it should set isExpandable to false', () => {
                lrsStatement.attemptId = null;
                statement = new ExpandableStatement(lrsStatement);
                expect(statement.isExpandable).toBeFalsy();
            });
        });

        describe('when lrsStatement has score', () => {
            it('should set hasScore to true', () => {
                lrsStatement.score = 100;
                statement = new ExpandableStatement(lrsStatement);
                expect(statement.hasScore).toBeTruthy();
            });
        });

        describe('when lrsStatement hasn\'t score', () => {
            it('should set hasScore to false', () => {
                lrsStatement.score = null;
                statement = new ExpandableStatement(lrsStatement);
                expect(statement.hasScore).toBeFalsy();
            });
        });

    });

    describe('[collapse]', () => {

        it('should be function', () => {
            expect(statement.collapse).toBeFunction();
        });

        it('should set isExpanded to false', () => {
            statement.isExpanded(true);
            statement.collapse();
            expect(statement.isExpanded()).toBeFalsy();
        });
    });

    describe('[load]', () => {

        it('should be function', () => {
            expect(statement.load).toBeFunction();
        });

        it('should return promise',  () => {
            expect(statement.load()).toBePromise();
        });

        describe('when user does not have access', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
                spyOn(upgradeDialog, 'show');
                lrsStatement.attemptId = null;
            });

            it('should show upgrade dialog', done => co(function*() {
                statement = new ExpandableStatement(lrsStatement);
                yield statement.load();
                expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.extendedResults);
            }).then(done));

            it('promise should return false', done => co(function*() {
                statement = new ExpandableStatement(lrsStatement);
                const result = yield statement.load();
                expect(result).toBeFalsy();
            }).then(done));

        });

        describe('when statement is not expandable', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
                lrsStatement.attemptId = null;
            });

            it('promise should return false', done => co(function*() {
                statement = new ExpandableStatement(lrsStatement);
                const result = yield statement.load();
                expect(result).toBeFalsy();
            }).then(done));

        });

        describe('when statement is already loaded', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
                lrsStatement.attemptId = 'id';
            });

            it('promise should return true', done => co(function*() {
                statement = new ExpandableStatement(lrsStatement);
                statement.children([{ id: 'id1' }]);
                const result = yield statement.load();
                statement.children = null;
                const result2 = yield statement.load();
                expect(result).toBeTruthy();
                expect(result2).toBeTruthy();
            }).then(done));

        });

        describe('when statement is not loaded yet', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
                lrsStatement.attemptId = 'id';
            });

            it('promise should return true and call expandLoadAction', done => co(function*() {
                statement = new ExpandableStatement(lrsStatement);
                statement.children([]);
                statement.expandLoadAction = () => true;
                
                spyOn(statement, 'expandLoadAction').and.returnValue(Promise.resolve(true));
                const result = yield statement.load();
                expect(statement.expandLoadAction).toHaveBeenCalled();
                expect(result).toBeTruthy();
            }).then(done));

        });

    });

    describe('[expand]', function () {

        beforeEach(() => {
            statement = new ExpandableStatement(lrsStatement);
        });

        it('should be function', function () {
            expect(statement.expand).toBeFunction();
        });

        it('should return promise', function () {
            expect(statement.expand()).toBePromise();
        });

        describe('when load return false', () => {

            beforeEach(() => {
                statement.isExpanded(false);
                spyOn(statement, 'load').and.returnValue(Promise.resolve(false));
            });

            it('should not set isExpanded to true', done => co(function*() {
                yield statement.expand();
                expect(statement.isExpanded()).toBeFalsy();
            }).then(done));

        });

        describe('when load return true', () => {

            beforeEach(() => {
                statement.isExpanded(false);
                spyOn(statement, 'load').and.returnValue(Promise.resolve(true));
             });

            it('should not set isExpanded to true', done => co(function*() {
                yield statement.expand();
                expect(statement.isExpanded()).toBeTruthy();
            }).then(done));

        });

    });
            
});
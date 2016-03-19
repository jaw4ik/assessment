import ResultsBase from './resultsBase';

import StartedStatement from './startedStatement';
import FinishStatement from './finishStatement';
import dialog from 'plugins/dialog';
import moment from 'moment';
import eventTracker from 'eventTracker';
import constants from 'constants';
import userContext from 'userContext';
import router from 'plugins/router';
import fileSaverWrapper from 'utils/fileSaverWrapper';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';

describe('ResultsBase:', function () {
    it('should return function', function () {
        expect(ResultsBase).toBeFunction();
    });
});

describe('ResultsBase instance', function () {

    var entityId,
        getEntityDefer;

    var viewLocation = 'noResultsViewLocation';
    var statementsProvider, repository, viewModel;

    var time = '2015-02-03_05-38';

    var fakeMoment = {
        format: function () {
            return time;
        }
    };

    var statements = [
        {
            id: 'id1',
            attemptId: '123',
            score: 10,
            actor: { name: 'name1', email: 'email1' },
            date: new Date(2015, 11, 10)
        },
        {
            id: 'id2',
            attemptId: '1234',
            score: 20,
            actor: { name: 'name2', email: 'email2' },
            date: new Date(2015, 11, 9)
        },
        {
            id: 'id3',
            attemptId: '12345',
            score: 30,
            actor: { name: 'name3', email: 'email3' },
            date: new Date(2015, 11, 8)
        },
        {
            id: 'id4',
            attemptId: '123456',
            score: 40,
            actor: { name: 'name4', email: 'email4' },
            date: new Date(2015, 11, 7)
        },
        {
            id: 'id5',
            attemptId: '1234567',
            score: 50,
            actor: { name: 'name5', email: 'email5' },
            date: new Date(2015, 11, 6)
        }
    ];

    beforeEach(function () {
        getEntityDefer = Q.defer();
        entityId = 'entityId';
        spyOn(eventTracker, 'publish');
        spyOn(router, 'openUrl');

        repository = jasmine.createSpyObj('repository', ['getById']);
        statementsProvider = jasmine.createSpyObj('statementsProvider', ['getLrsStatements']);
        repository.getById.and.returnValue(getEntityDefer.promise);

        window.moment = moment;
        spyOn(window, 'moment').and.returnValue(fakeMoment);
        spyOn(fakeMoment, 'format').and.returnValue(time);
        viewModel = new ResultsBase(repository.getById, statementsProvider.getLrsStatements, viewLocation);
    });

    afterEach(function() {
        window.moment = null;
    });

    describe('entityId:', function () {
        it('should be defined', function () {
            expect(viewModel.entityId).toBeDefined();
        });

        it('should be an empty string', function () {
            expect(viewModel.entityId).toBe('');
        });
    });

    describe('noResultsViewLocation:', function () {
        it('should be defined', function () {
            expect(viewModel.noResultsViewLocation).toBeDefined();
        });

        it('should be equal to value that was passed to ctor', function () {
            expect(viewModel.noResultsViewLocation).toBe(viewLocation);
        });
    });

    describe('entityTitle:', function () {
        it('should be defined', function () {
            expect(viewModel.entityTitle).toBeDefined();
        });

        it('should be an empty string', function () {
            expect(viewModel.entityTitle).toBe('');
        });
    });

    describe('loadedResults', function () {
        it('should be defined', function () {
            expect(viewModel.loadedResults).toBeDefined();
        });

        it('should be an empty array', function () {
            expect(viewModel.loadedResults).toBeArray();
            expect(viewModel.loadedResults.length).toBe(0);
        });
    });

    describe('pageNumber:', function () {
        it('should be defined', function () {
            expect(viewModel.pageNumber).toBeDefined();
        });

        it('should be 1', function () {
            expect(viewModel.pageNumber).toBe(1);
        });
    });

    describe('allResultsLoaded:', function () {
        it('should be defined', function () {
            expect(viewModel.allResultsLoaded).toBeDefined();
        });

        it('should be false', function () {
            expect(viewModel.allResultsLoaded).toBeFalsy();
        });
    });

    describe('isLoading:', function () {
        it('should be observable', function () {
            expect(viewModel.isLoading).toBeObservable();
        });

        it('should be true observable by default', function () {
            expect(viewModel.isLoading()).toBeTruthy();
        });
    });

    describe('results:', function () {
        it('should be observable array', function () {
            expect(viewModel.results).toBeObservableArray();
        });

        it('should be empty by default', function () {
            expect(viewModel.results().length).toBe(0);
        });
    });

    describe('extendStatement:', function () {
        it('should be function', function () {
            expect(viewModel.extendStatement).toBeFunction();
        });

        it('should extend statement', function () {
            var finishStatement = new FinishStatement(statements[0]);
            var startedStatement = new StartedStatement(statements[0]);
            viewModel.extendStatement(finishStatement);
            viewModel.extendStatement(startedStatement);

            expect(finishStatement).toBeInstanceOf(FinishStatement);
            expect(finishStatement.isFinished).toBeTruthy();

            expect(startedStatement).toBeInstanceOf(StartedStatement);
            expect(startedStatement.isFinished).toBeFalsy();
        });

        it('should return extended statement', function () {
            var finishStatement = new FinishStatement(statements[0]);
            var extended = viewModel.extendStatement(finishStatement);
            expect(finishStatement).toBe(extended);
        });

    });

    describe('activate:', function () {

        it('should return promise', function () {
            expect(viewModel.activate()).toBePromise();
        });

        it('should get entity from repository', function () {
            viewModel.activate(entityId);
            expect(repository.getById).toHaveBeenCalledWith(entityId);
        });

        it('should fill entityId for viewModel', function () {
            viewModel.activate(entityId);
            expect(viewModel.entityId).toBe(entityId);
        });

        it('should empty results array', function () {
            viewModel.results(['element1', 'element2']);
            viewModel.activate(entityId);
            expect(viewModel.results().length).toBe(0);
        });

        it('should empty loaded results', function () {
            viewModel.loadedResults = ['element1', 'element2'];
            viewModel.activate(entityId);
            expect(viewModel.loadedResults.length).toBe(0);
        });

        it('should reset page to first', function () {
            viewModel.activate(entityId);
            expect(viewModel.pageNumber).toBe(1);
        });

        it('should set allResultsLoaded to false', function () {
            viewModel.allResultsLoaded = true;
            viewModel.activate(entityId);
            expect(viewModel.allResultsLoaded).toBeFalsy();
        });

        it('should set allDetailedResultsLoaded to false', function () {
            viewModel.allDetailedResultsLoaded = true;
            viewModel.activate(entityId);
            expect(viewModel.allDetailedResultsLoaded).toBeFalsy();
        });

        it('should set cachedResultsForDownload to null', function () {
            viewModel.cachedResultsForDownload = true;
            viewModel.activate(entityId);
            expect(viewModel.cachedResultsForDownload).toBeNull();
        });

        describe('when entity exists', function () {

            var entity = { id: 'entityId', title: 'title' };

            beforeEach(function () {
                getEntityDefer.resolve(entity);
            });

            it('should set entityTitle', function (done) {
                viewModel.activate(entity.id).fin(function () {
                    expect(viewModel.entityTitle).toBe(entity.title);
                    done();
                });
            });
        });
    });

    describe('deactivate:', function () {
        it('should be function', function () {
            expect(viewModel.deactivate).toBeFunction();
        });

        it('should remove all items from results collection', function () {
            viewModel.results.push({});
            viewModel.results.push({});
            viewModel.deactivate();
            expect(viewModel.results().length).toBe(0);
        });

        it('should empty loaded results', function () {
            viewModel.loadedResults = ['element1', 'element2'];
            viewModel.deactivate();
            expect(viewModel.loadedResults.length).toBe(0);
        });
    });

    describe('attached:', function () {

        var getLrsStatementsDfd;

        beforeEach(function () {
            getLrsStatementsDfd = Q.defer();
            statementsProvider.getLrsStatements.and.returnValue(getLrsStatementsDfd.promise);
            viewModel.activate(entityId);
        });

        it('should return a promise', function () {
            getLrsStatementsDfd.resolve({});
            expect(viewModel.attached()).toBePromise();
        });

        it('should call getLrsStatements with correct params', function (done) {
            getLrsStatementsDfd.resolve({});
            viewModel.attached().fin(function () {
                expect(statementsProvider.getLrsStatements).toHaveBeenCalledWith({
                    entityId: entityId,
                    embeded: false,
                    take: constants.results.pageSize + 1,
                    skip: 0
                });
                done();
            });
        });

        describe('when getLrsStatements failed', function () {

            beforeEach(function () {
                viewModel.isLoading(true);
                getLrsStatementsDfd.reject();
            });

            it('should set isLoading to false', function (done) {
                viewModel.attached().fin(function () {
                    expect(viewModel.isLoading()).toBeFalsy();
                    done();
                });
            });

        });

        describe('when getLrsStatements returned statements', function () {

            beforeEach(function () {
                getLrsStatementsDfd.resolve(statements);
            });

            it('should set isLoading to false', function (done) {
                viewModel.isLoading(true);
                viewModel.attached().fin(function () {
                    expect(viewModel.isLoading()).toBeFalsy();
                    done();
                });
            });

            it('should fill results field with results', function (done) {
                constants.results.pageSize = 10;
                viewModel.attached().fin(function () {
                    expect(viewModel.results()[0]).toBe(statements[0]);
                    expect(viewModel.results().length).toBe(statements.length);
                    done();
                });
            });

            describe('and number of result statemets less than page size + 1', function () {

                beforeEach(function () {
                    viewModel.allResultsLoaded = false;
                    constants.results.pageSize = 10;
                });

                it('should set allResultsLoaded to true', function (done) {
                    viewModel.attached().fin(function () {
                        expect(viewModel.allResultsLoaded).toBeTruthy();
                        done();
                    });
                });

            });

            describe('and number of resul statemets equals page size + 1', function () {

                beforeEach(function () {
                    viewModel.allResultsLoaded = false;
                    constants.results.pageSize = 1;
                });

                it('should not set allResultsLoaded to false', function (done) {
                    viewModel.attached().fin(function () {
                        expect(viewModel.allResultsLoaded).toBeFalsy();
                        done();
                    });
                });

            });

        });

    });

    describe('showMoreResults:', function () {

        var getLrsStatementsDfd;

        beforeEach(function () {
            getLrsStatementsDfd = Q.defer();
            viewModel.activate(entityId);

            spyOn(dialog, 'show');
            statementsProvider.getLrsStatements.and.returnValue(getLrsStatementsDfd.promise);
        });

        it('should be function', function () {
            expect(viewModel.showMoreResults).toBeFunction();
        });

        it('should send event \'Show more results\'', function (done) {
            viewModel.showMoreResults().fin(function () {
                expect(eventTracker.publish).toHaveBeenCalledWith('Show more results');
                done();
            });
        });

        it('should return promise', function () {
            expect(viewModel.showMoreResults()).toBePromise();
        });

        describe('when no more results', function () {
            beforeEach(function () {
                viewModel.loadedResults = [1];
                viewModel.results([1, 2, 3]);
            });

            it('should not call getLrsStatements', function (done) {
                viewModel.showMoreResults().fin(function () {
                    expect(statementsProvider.getLrsStatements).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not change page number', function (done) {
                viewModel.pageNumber = 1;
                viewModel.showMoreResults().fin(function () {
                    expect(viewModel.pageNumber).toEqual(1);
                    done();
                });

            });
        });

        describe('when not all results are shown', function () {

            beforeEach(function () {
                viewModel.pageNumber = 0;
                viewModel.loadedResults = [1, 2, 3];
                constants.results.pageSize = 1;
                viewModel.results([]);
            });

            describe('and user access type forbids to view more results', function () {
                beforeEach(function () {
                    userContext.identity = {
                        email: 'test@test.com',
                        subscription: {
                            accessType: constants.accessType.free,
                            expirationDate: new Date().setYear(1990)
                        }
                    };
                });

                it('should not increase page number', function (done) {
                    var pageNumber = viewModel.pageNumber;
                    viewModel.showMoreResults().fin(function () {
                        expect(viewModel.pageNumber).toEqual(pageNumber);
                        done();
                    });
                });

                it('should not add loaded result for new page to results array', function (done) {
                    viewModel.showMoreResults().fin(function () {
                        expect(viewModel.results().length).toEqual(0);
                        done();
                    });
                });

            });

            describe('and user access type allows to view more results', function () {

                beforeEach(function () {
                    userContext.identity = {
                        email: 'test@test.com',
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: new Date().setYear(2055)
                        }
                    };
                });

                it('should increase page number', function (done) {
                    var pageNumber = viewModel.pageNumber;
                    viewModel.showMoreResults().fin(function () {
                        expect(viewModel.pageNumber).toEqual(pageNumber + 1);
                        done();
                    });
                });

                describe('when requested results were already loaded', function () {

                    it('should not get LRS statements', function (done) {
                        viewModel.showMoreResults().fin(function () {
                            expect(statementsProvider.getLrsStatements).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should add loaded result for new page to results array', function (done) {
                        viewModel.showMoreResults().fin(function () {
                            expect(viewModel.results().length).toEqual(viewModel.pageNumber * constants.results.pageSize);
                            done();
                        });
                    });
                });

                describe('when all results were loaded by download results functionality', function () {
                    beforeEach(function () {
                        constants.results.pageSize = 5;
                        viewModel.allResultsLoaded = true;
                    });

                    it('should not get LRS statements', function (done) {
                        viewModel.showMoreResults().fin(function () {
                            expect(statementsProvider.getLrsStatements).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should add loaded result for new page to results array', function (done) {
                        viewModel.showMoreResults().fin(function () {
                            expect(viewModel.results().length).toEqual(3);
                            done();
                        });
                    });
                });

                describe('when requested results were not loaded yet', function () {

                    beforeEach(function () {
                        viewModel.loadedResults = [1, 2, 3];
                        viewModel.results([]);
                        viewModel.allResultsLoaded = false;
                        viewModel.pageNumber = 1;
                        constants.results.pageSize = 5;
                    });

                    it('should get next part of statements', function (done) {
                        getLrsStatementsDfd.resolve({});
                        viewModel.showMoreResults().fin(function () {
                            expect(statementsProvider.getLrsStatements).toHaveBeenCalledWith({
                                entityId: entityId,
                                embeded: false,
                                take: constants.results.pageSize + 1,
                                skip: 5
                            });
                            done();
                        });
                    });

                    describe('when getLrsStatements returned statements', function () {

                        beforeEach(function () {
                            getLrsStatementsDfd.resolve(statements);
                        });

                        it('should fill results field with results', function (done) {
                            viewModel.showMoreResults().fin(function () {
                                expect(viewModel.results()[0]).toBe(statements[0]);
                                expect(viewModel.results().length).toBe(statements.length);
                                done();
                            });
                        });

                    });
                });
            });
        });
    });

    describe('downloadResults:', function () {

        var getLrsStatementsDfd;

        beforeEach(function () {
            getLrsStatementsDfd = Q.defer();
            viewModel.activate(entityId);

            statementsProvider.getLrsStatements.and.returnValue(getLrsStatementsDfd.promise);
            getLrsStatementsDfd.resolve(_.map(statements, function(statement) { return new FinishStatement(statement);  }));

            fileSaverWrapper.saveAs = function () { };
            spyOn(fileSaverWrapper, 'saveAs');
        });

        it('should be function', function () {
            expect(viewModel.downloadResults).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.downloadResults()).toBePromise();
        });

        it('should send event \'Download results\'', function (done) {
            viewModel.downloadResults().fin(function () {
                expect(eventTracker.publish).toHaveBeenCalledWith('Download results');
                done();
            });
        });

        describe('when user access type allows to view more results', function () {

            beforeEach(function () {
                userContext.identity = {
                    email: 'test@test.com',
                    subscription: {
                        accessType: constants.accessType.plus,
                        expirationDate: new Date().setYear(2055)
                    }
                };
            });

            describe('and all results for download were already generated', function () {
                beforeEach(function () {
                    viewModel.cachedResultsForDownload = ['name,score'];
                });

                it('should not get Lrs statements', function (done) {
                    viewModel.downloadResults().fin(function () {
                        expect(statementsProvider.getLrsStatements).not.toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('and all results were already loaded', function () {
                beforeEach(function () {
                    viewModel.loadedResults = [];
                    viewModel.allResultsLoaded = true;
                    viewModel.allDetailedResultsLoaded = true;
                });

                it('should not get Lrs statements', function (done) {
                    viewModel.downloadResults().fin(function () {
                        expect(statementsProvider.getLrsStatements).not.toHaveBeenCalled();
                        done();
                    });
                });

            });

            describe('and all results were not loaded yet', function () {

                beforeEach(function () {
                    viewModel.loadedResults = [];
                    viewModel.allResultsLoaded = false;
                    viewModel.allDetailedResultsLoaded = false;
                });

                it('should get LRS statements', function (done) {
                    viewModel.downloadResults().fin(function () {
                        expect(statementsProvider.getLrsStatements).toHaveBeenCalledWith({ entityId: viewModel.entityId, embeded: undefined, take: undefined, skip: undefined });
                        done();
                    });
                });

                it('should set allResultsLoaded to true', function (done) {
                    viewModel.downloadResults().fin(function () {
                        expect(viewModel.allResultsLoaded).toBeTruthy();
                        done();
                    });
                });

                it('should set resultsForDownload', function (done) {
                    viewModel.cachedResultsForDownload = null;
                    viewModel.downloadResults().fin(function () {
                        expect(viewModel.cachedResultsForDownload).toBeString();
                        done();
                    });
                });

            });

        });

        describe('when user access type forbids to downloadResults', function () {

            beforeEach(function () {
                spyOn(upgradeDialog, 'show');
                userContext.identity = {
                    email: 'test@test.com',
                    subscription: {
                        accessType: constants.accessType.free,
                        expirationDate: new Date().setYear(1990)
                    }
                };
            });

            it('should show upgrade results dialog', function (done) {
                viewModel.downloadResults().fin(function () {
                    expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.downloadResults);
                    done();
                });
            });

            it('should not call saveAs', function (done) {
                viewModel.downloadResults().fin(function () {
                    expect(fileSaverWrapper.saveAs).not.toHaveBeenCalled();
                    done();
                });
            });

        });

    });

    describe('noResults:', function () {
        it('should be computed', function () {
            expect(viewModel.noResults).toBeComputed();
        });

        it('should be true if results field contains no elements', function () {
            viewModel.results([]);
            expect(viewModel.noResults()).toBeTruthy();
        });

        it('should be false if results field contains the elements', function () {
            viewModel.results(['some element']);
            expect(viewModel.noResults()).toBeFalsy();
        });
    });

    describe('hasMoreResults:', function () {

        it('should be computed', function () {
            expect(viewModel.hasMoreResults).toBeComputed();
        });

        describe('when shown more results than loaded', function () {

            it('should return true', function () {
                viewModel.loadedResults = [1, 2, 3];
                viewModel.results([viewModel.loadedResults[0]]);

                expect(viewModel.hasMoreResults()).toBeTruthy();
            });

        });

        describe('when all loaded results shown', function () {

            it('should return false', function () {
                viewModel.loadedResults = [1, 2, 3];
                viewModel.results(viewModel.loadedResults);

                expect(viewModel.hasMoreResults()).toBeFalsy();
            });

        });

    });

});
define(['reporting/viewmodels/resultsBase', 'plugins/dialog'], function (ResultsBase, dialog) {
    "use strict";

    var eventTracker = require('eventTracker'),
        constants = require('constants'),
        userContext = require('userContext'),
        router = require('plugins/router'),
        StartedStatement = require('reporting/viewmodels/startedStatement'),
        FinishStatement = require('reporting/viewmodels/finishStatement'),
        fileSaverWrapper = require('utils/fileSaverWrapper');

    describe('ResultsBase:', function () {
        it('should return function', function () {
            expect(ResultsBase).toBeFunction();
        });
    });

    describe('ResultsBase instance', function () {

        var entityId,
            getEntityDefer;

        var viewLocation = 'noResultsViewLocation';
        var xApiProvider, repository, viewModel, viewModelWithoutStarted;

        var time = '2015-02-03_05-38';

        var fakeMoment = {
            format: function () {
                return time;
            }
        };

        var startedStatements = [
                {
                    id: 'id1',
                    attemptId: '123',
                    score: null,
                    actor: { name: 'name1', email: 'email1' }
                },
                {
                    id: 'id2',
                    attemptId: '1234',
                    score: null,
                    actor: { name: 'name2', email: 'email2' }
                },
                {
                    id: 'id3',
                    attemptId: '12345',
                    score: null,
                    actor: { name: 'name3', email: 'email3' }
                },
                {
                    id: 'id4',
                    attemptId: '123456',
                    score: null,
                    actor: { name: 'name4', email: 'email4' }
                },
                {
                    id: 'id5',
                    attemptId: '1234567',
                    score: null,
                    actor: { name: 'name5', email: 'email5' }
                },
                {
                    id: 'id6',
                    attemptId: '12345678',
                    score: null,
                    actor: { name: 'name6', email: 'email6' }
                }
        ],
            finishStatements = [
                {
                    id: 'id1',
                    attemptId: '123',
                    score: 10,
                    actor: { name: 'name1', email: 'email1' }
                },
                {
                    id: 'id2',
                    attemptId: '1234',
                    score: 20,
                    actor: { name: 'name2', email: 'email2' }
                },
                {
                    id: 'id3',
                    attemptId: '12345',
                    score: 30,
                    actor: { name: 'name3', email: 'email3' }
                },
                {
                    id: 'id4',
                    attemptId: '123456',
                    score: 40,
                    actor: { name: 'name4', email: 'email4' }
                },
                {
                    id: 'id5',
                    attemptId: '1234567',
                    score: 50,
                    actor: { name: 'name5', email: 'email5' }
                }
            ];

        beforeEach(function () {
            getEntityDefer = Q.defer();
            entityId = 'entityId';
            spyOn(eventTracker, 'publish');
            spyOn(router, 'openUrl');

            repository = jasmine.createSpyObj('repository', ['getById']);
            xApiProvider = jasmine.createSpyObj('xApiProvider', ['getStartedStatements', 'getFinishedStatements']);
            repository.getById.and.returnValue(getEntityDefer.promise);

            spyOn(window, 'moment').and.returnValue(fakeMoment);
            spyOn(fakeMoment, 'format').and.returnValue(time);
            viewModel = new ResultsBase(repository.getById, xApiProvider.getStartedStatements, xApiProvider.getFinishedStatements, viewLocation);
            viewModelWithoutStarted = new ResultsBase(repository.getById, null, xApiProvider.getFinishedStatements, viewLocation);
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
                var finishStatement = new FinishStatement(finishStatements[0]);
                var startedStatement = new StartedStatement(startedStatements[0]);
                viewModel.extendStatement(finishStatement);
                viewModel.extendStatement(startedStatement);

                expect(finishStatement).toBeInstanceOf(FinishStatement);
                expect(finishStatement.isFinished).toBeTruthy();
                
                expect(startedStatement).toBeInstanceOf(StartedStatement);
                expect(startedStatement.isFinished).toBeFalsy();
            });

            it('should return extended statement', function() {
                var finishStatement = new FinishStatement(finishStatements[0]);
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

            describe('when entity exists', function () {

                var
                    entity = { id: 'entityId', title: 'title' };

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

            var startedDfd,
                finishDfd;

            beforeEach(function () {
                startedDfd = Q.defer();
                finishDfd = Q.defer();
                xApiProvider.getStartedStatements.and.returnValue(startedDfd.promise);
                xApiProvider.getFinishedStatements.and.returnValue(finishDfd.promise);
                startedDfd.resolve(startedStatements);
                finishDfd.resolve(finishStatements);
            });

            it('should return a promise', function () {
                startedDfd.resolve(null);
                finishDfd.resolve(null);
                expect(viewModel.attached()).toBePromise();
            });

            describe('when getStartedStatements is not defined', function () {
                beforeEach(function () {
                    viewModelWithoutStarted.activate(entityId);
                });

                it('should call getFinishedStatements with correct params', function (done) {
                    viewModelWithoutStarted.attached().fin(function () {
                        expect(xApiProvider.getFinishedStatements).toHaveBeenCalledWith(
                            entityId,
                            constants.results.pageSize + 1,
                            0
                        );
                        done();
                    });
                });

                describe('and getFinishedStatements failed', function () {

                    beforeEach(function () {
                        viewModelWithoutStarted.isLoading(true);
                        finishDfd.reject();
                    });

                    it('should set isLoading to false', function (done) {
                        viewModelWithoutStarted.attached().fin(function () {
                            expect(viewModelWithoutStarted.isLoading()).toBeFalsy();
                            done();
                        });
                    });

                });

                describe('and getFinishedStatements returned statements', function () {

                    it('should set isLoading to false', function (done) {
                        viewModelWithoutStarted.isLoading(true);
                        viewModelWithoutStarted.attached().fin(function () {
                            expect(viewModelWithoutStarted.isLoading()).toBeFalsy();
                            done();
                        });
                    });

                    it('should fill results field with results', function (done) {
                        constants.results.pageSize = 1;
                        viewModelWithoutStarted.attached().fin(function () {
                            expect(viewModelWithoutStarted.results()[0].lrsStatement).toBe(finishStatements[0]);
                            expect(viewModelWithoutStarted.results()[0]).toBeInstanceOf(FinishStatement);
                            expect(viewModelWithoutStarted.results().length).toBe(1);
                            done();
                        });
                    });

                    describe('and number of statemets less than page size + 1', function () {

                        beforeEach(function () {
                            viewModelWithoutStarted.allResultsLoaded = false;
                            constants.results.pageSize = 10;
                        });

                        it('should set allResultsLoaded to true', function (done) {
                            viewModelWithoutStarted.attached().fin(function () {
                                expect(viewModelWithoutStarted.allResultsLoaded).toBeTruthy();
                                done();
                            });
                        });

                    });

                    describe('and number of statemets equals page size + 1', function () {

                        beforeEach(function () {
                            viewModelWithoutStarted.allResultsLoaded = false;
                            constants.results.pageSize = 1;
                        });

                        it('should not set allResultsLoaded to false', function (done) {
                            viewModelWithoutStarted.attached().fin(function () {
                                expect(viewModelWithoutStarted.allResultsLoaded).toBeFalsy();
                                done();
                            });
                        });

                    });

                });

            });

            describe('when getStartedStatements is defined', function () {

                beforeEach(function () {
                    viewModel.activate(entityId);
                });

                it('should call getStartedStatements with correct params', function (done) {
                    viewModel.attached().fin(function () {
                        expect(xApiProvider.getStartedStatements).toHaveBeenCalledWith(
                            entityId,
                            constants.results.pageSize + 1,
                            0
                        );
                        done();
                    });
                });

                describe('and getStartedStatements failed', function () {

                    beforeEach(function () {
                        viewModel.isLoading(true);
                        startedDfd.reject();
                    });

                    it('should set isLoading to false', function (done) {
                        viewModel.attached().fin(function () {
                            expect(viewModel.isLoading()).toBeFalsy();
                            done();
                        });
                    });

                });

                describe('and getStartedStatements returned statements', function () {

                    it('should set isLoading to false', function (done) {
                        viewModel.isLoading(true);
                        viewModel.attached().fin(function () {
                            expect(viewModel.isLoading()).toBeFalsy();
                            done();
                        });
                    });

                    it('should call getFinishedStatements with correct params', function (done) {
                        viewModel.attached().fin(function () {
                            expect(xApiProvider.getFinishedStatements).toHaveBeenCalledWith(
                                _.map(startedStatements, function (statement) {
                                    return statement.attemptId;
                                })
                            );
                            done();
                        });
                    });

                    describe('and getFinishedStatements failed', function () {

                        beforeEach(function () {
                            viewModel.isLoading(true);
                            finishDfd.reject();
                        });

                        it('should set isLoading to false', function (done) {
                            viewModel.attached().fin(function () {
                                expect(viewModel.isLoading()).toBeFalsy();
                                done();
                            });
                        });

                    });

                    describe('and getFinishedStatements returned statements', function () {

                        it('should set isLoading to false', function (done) {
                            viewModel.isLoading(true);
                            viewModel.attached().fin(function () {
                                expect(viewModel.isLoading()).toBeFalsy();
                                done();
                            });
                        });

                        it('should fill results field with distinct results sorted by date', function (done) {
                            constants.results.pageSize = 10;
                            viewModel.attached().fin(function () {
                                expect(viewModel.results()[0].lrsStatement).toBe(startedStatements[startedStatements.length - 1]);
                                expect(viewModel.results()[0]).toBeInstanceOf(StartedStatement);
                                expect(viewModel.results()[1].lrsStatement).toBe(finishStatements[finishStatements.length - 1]);
                                expect(viewModel.results()[1]).toBeInstanceOf(FinishStatement);
                                expect(viewModel.results().length).toBe(startedStatements.length);
                                done();
                            });
                        });

                        describe('and number of statemets less than page size + 1', function () {

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

                        describe('and number of statemets equals page size + 1', function () {

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

            });

        });

        describe('showMoreResults:', function () {

            var startedDfd,
                finishDfd;

            beforeEach(function () {
                startedDfd = Q.defer();
                finishDfd = Q.defer();
                viewModel.activate(entityId);
                viewModelWithoutStarted.activate(entityId);
                spyOn(dialog, 'show');
                xApiProvider.getStartedStatements.and.returnValue(startedDfd.promise);
                xApiProvider.getFinishedStatements.and.returnValue(finishDfd.promise);
                startedDfd.resolve(startedStatements);
                finishDfd.resolve(finishStatements);
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

                it('should not call getStartedStatements', function (done) {
                    viewModel.showMoreResults().fin(function () {
                        expect(xApiProvider.getStartedStatements).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should not call getFinishStatements', function (done) {
                    viewModel.showMoreResults().fin(function () {
                        expect(xApiProvider.getFinishedStatements).not.toHaveBeenCalled();
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

                describe('when user access type forbids to view more results', function () {
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

                    it('should increase page number', function (done) {
                        var pageNumber = viewModel.pageNumber;
                        viewModel.showMoreResults().fin(function () {
                            expect(viewModel.pageNumber).toEqual(pageNumber + 1);
                            done();
                        });
                    });

                    describe('when requested results were already loaded', function () {

                        it('should not call getStartedStatements to load results', function (done) {
                            viewModel.showMoreResults().fin(function () {
                                expect(xApiProvider.getStartedStatements).not.toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should not call getFinishedStatements to load results', function (done) {
                            viewModel.showMoreResults().fin(function () {
                                expect(xApiProvider.getFinishedStatements).not.toHaveBeenCalled();
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

                        it('should not call getStartedStatements to load results', function (done) {
                            viewModel.showMoreResults().fin(function () {
                                expect(xApiProvider.getStartedStatements).not.toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should not call getFinishedStatements to load results', function (done) {
                            viewModel.showMoreResults().fin(function () {
                                expect(xApiProvider.getFinishedStatements).not.toHaveBeenCalled();
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

                        describe('and getStartedStatements is not defined', function () {

                            beforeEach(function () {
                                viewModelWithoutStarted.loadedResults = [1, 2, 3];
                                viewModelWithoutStarted.results([]);
                                viewModelWithoutStarted.allResultsLoaded = false;
                                viewModelWithoutStarted.pageNumber = 1;
                                constants.results.pageSize = 5;
                            });

                            it('should call getFinishedStatements with correct params', function (done) {
                                viewModelWithoutStarted.showMoreResults().fin(function () {
                                    expect(xApiProvider.getFinishedStatements).toHaveBeenCalledWith(
                                        entityId,
                                        constants.results.pageSize + 1,
                                        5
                                    );
                                    done();
                                });
                            });

                            describe('when getFinishedStatements returned statements', function () {
                                it('should fill results field with results', function (done) {
                                    viewModelWithoutStarted.showMoreResults().fin(function () {
                                        expect(viewModelWithoutStarted.results()[0].lrsStatement).toBe(finishStatements[0]);
                                        expect(viewModelWithoutStarted.results()[0]).toBeInstanceOf(FinishStatement);
                                        expect(viewModelWithoutStarted.results().length).toBe(5);
                                        done();
                                    });
                                });
                            });

                        });

                        describe('and getStartedStatements is defined', function () {

                            beforeEach(function () {
                                viewModel.loadedResults = [1, 2, 3];
                                viewModel.results([]);
                                viewModel.allResultsLoaded = false;
                                viewModel.pageNumber = 1;
                                constants.results.pageSize = 5;
                            });

                            it('should call getStartedStatements with correct params', function (done) {
                                viewModel.showMoreResults().fin(function () {
                                    expect(xApiProvider.getStartedStatements).toHaveBeenCalledWith(
                                        entityId,
                                        constants.results.pageSize + 1,
                                        5
                                    );
                                    done();
                                });
                            });

                            describe('when getStartedStatements returned statements', function () {

                                it('should call getFinishedStatements with correct params', function (done) {
                                    viewModel.showMoreResults().fin(function () {
                                        expect(xApiProvider.getFinishedStatements).toHaveBeenCalledWith(
                                            _.map(startedStatements.slice(0, 6), function(statement) { return statement.attemptId; })
                                        );
                                        done();
                                    });
                                });

                                describe('and getFinishedStatements returned statements', function() {

                                    it('should fill results field with distinct results ordered by date', function (done) {
                                        viewModel.showMoreResults().fin(function () {
                                            expect(viewModel.results()[0].lrsStatement).toBe(startedStatements[startedStatements.length - 1]);
                                            expect(viewModel.results()[0]).toBeInstanceOf(StartedStatement);
                                            expect(viewModel.results()[1].lrsStatement).toBe(finishStatements[finishStatements.length - 1]);
                                            expect(viewModel.results()[1]).toBeInstanceOf(FinishStatement);
                                            expect(viewModel.results().length).toBe(5);
                                            done();
                                        });
                                    });

                                });

                            });

                        });

                        describe('when all results are loaded', function () {
                            it('should set allResultsLoaded to true', function (done) {
                                constants.results.pageSize = 10;
                                viewModel.showMoreResults().fin(function () {
                                    expect(viewModel.allResultsLoaded).toBeTruthy();
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

        describe('downloadResults:', function () {

            var startedDfd,
                 finishDfd;

            beforeEach(function () {
                startedDfd = Q.defer();
                finishDfd = Q.defer();
                viewModel.activate(entityId);
                viewModelWithoutStarted.activate(entityId);
                xApiProvider.getStartedStatements.and.returnValue(startedDfd.promise);
                xApiProvider.getFinishedStatements.and.returnValue(finishDfd.promise);
                startedDfd.resolve(startedStatements);
                finishDfd.resolve(finishStatements);

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

                describe('and all results were already loaded', function () {
                    beforeEach(function () {
                        viewModel.loadedResults = [];
                        viewModel.allResultsLoaded = true;
                    });

                    it('should not call getStartedStatements', function (done) {
                        viewModel.downloadResults().fin(function () {
                            expect(xApiProvider.getStartedStatements).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should not call getFinishedStatements', function (done) {
                        viewModel.downloadResults().fin(function () {
                            expect(xApiProvider.getFinishedStatements).not.toHaveBeenCalled();
                            done();
                        });
                    });

                });

                describe('and all results were not loaded yet', function () {

                    beforeEach(function () {
                        viewModel.loadedResults = [];
                        viewModel.allResultsLoaded = false;
                        viewModelWithoutStarted.loadedResults = [];
                        viewModelWithoutStarted.allResultsLoaded = false;
                    });

                    describe('and getStartedStatements is not defined', function() {

                        it('should call getFinishedStatements', function(done) {
                            viewModelWithoutStarted.downloadResults().fin(function () {
                                expect(xApiProvider.getFinishedStatements).toHaveBeenCalledWith(viewModelWithoutStarted.entityId, undefined, undefined);
                                done();
                            });
                        });

                        it('should set allResultsLoaded to true', function (done) {
                            viewModelWithoutStarted.downloadResults().fin(function () {
                                expect(viewModelWithoutStarted.allResultsLoaded).toBeTruthy();
                                done();
                            });
                        });

                    });

                    describe('and getStartedStatements is defined', function () {

                        it('should call getStartedStatements', function (done) {
                            viewModel.downloadResults().fin(function () {
                                expect(xApiProvider.getStartedStatements).toHaveBeenCalledWith(viewModel.entityId, undefined, undefined);
                                done();
                            });
                        });

                        describe('and getStartedStatements returned statements', function() {

                            it('should call getFinishedStatements with correct args', function (done) {
                                viewModel.downloadResults().fin(function () {
                                    expect(xApiProvider.getFinishedStatements).toHaveBeenCalledWith(_.map(startedStatements, function (statement) { return statement.attemptId; }));
                                    done();
                                });
                            });

                        });

                        it('should set allResultsLoaded to true', function (done) {
                            viewModel.downloadResults().fin(function () {
                                expect(viewModel.allResultsLoaded).toBeTruthy();
                                done();
                            });
                        });

                    });

                });
            });

            describe('when user access type forbids to downloadResults', function () {
                var upgradeDialog = require('widgets/upgradeDialog/viewmodel');

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
});

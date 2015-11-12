define(['constants', 'userContext', 'localization/localizationManager', 'eventTracker', 'utils/fileSaverWrapper', 'widgets/upgradeDialog/viewmodel', 'reporting/viewmodels/startedStatement', 'reporting/viewmodels/finishStatement'],
    function (constants, userContext, localizationManager, eventTracker, fileSaverWrapper, upgradeDialog, StartedStatement, FinishStatement) {
        "use strict";

        var viewModel = function (getEntity, getLrsStatements, noResultsViewLocation) {
            var that = this;

            var events = {
                showMoreResults: 'Show more results',
                downloadResults: 'Download results'
            };

            that.entityId = '';
            that.entityTitle = '';
            that.loadedResults = [];
            that.pageNumber = 1;
            that.results = ko.observableArray([]);
            that.allResultsLoaded = false;
            that.isLoading = ko.observable(true);
            that.noResultsViewLocation = noResultsViewLocation;

            that.deactivate = function () {
                that.results([]);
                that.loadedResults = [];
            };

            that.attached = function () {
                that.isLoading(true);
                return loadStatements(that.entityId, constants.results.pageSize, 0)
                    .then(function (reportingStatements) {
                        that.results.push.apply(that.results, reportingStatements);
                    }).fin(function () {
                        that.isLoading(false);
                    });
            };

            that.showMoreResults = function () {
                eventTracker.publish(events.showMoreResults);
                return Q.fcall(function () {
                    if (!that.hasMoreResults()) {
                        return undefined;
                    }
                    if (!userContext.hasStarterAccess()) {
                        upgradeDialog.show(constants.dialogs.upgrade.settings.loadMoreResults);
                        return undefined;
                    }

                    return loadStatements(that.entityId, constants.results.pageSize, that.pageNumber * constants.results.pageSize)
                        .then(function (reportingStatements) {
                            that.results.push.apply(that.results, reportingStatements);
                            that.pageNumber++;
                        });
                });
            };

            that.downloadResults = function downloadResults() {
                eventTracker.publish(events.downloadResults);
                return Q.fcall(function () {
                    if (!userContext.hasStarterAccess()) {
                        upgradeDialog.show(constants.dialogs.upgrade.settings.downloadResults);
                        return;
                    }

                    return generateResultsCsvBlob().then(function (blob) {
                        var name = getResultsFileName();
                        fileSaverWrapper.saveAs(blob, name);
                    });
                });
            };

            that.noResults = ko.computed(function () {
                return that.results().length === 0;
            });

            that.hasMoreResults = ko.computed(function () {
                return that.results().length < that.loadedResults.length;
            });

            that.activate = function (entityId) {
                that.results([]);
                that.loadedResults = [];
                that.pageNumber = 1;
                that.entityId = entityId;
                that.allResultsLoaded = false;
                return getEntity(entityId).then(function (entity) {
                    that.entityTitle = entity.title;
                });
            }

            that.viewUrl = 'reporting/views/results';

            that.extendStatement = function (statement) {
                statement.isFinished = statement instanceof FinishStatement;
                return statement;
            }

            function loadLrsStatements(entityId, take, skip) {
                return getLrsStatements(entityId, take, skip).then(function (statements) {
                    return mapLrsStatements(statements.started, statements.finished);
                });
            }

            function mapLrsStatements(startedStatements, finishedStatements) {
                if (!startedStatements) {
                    return _.map(finishedStatements, function(statement) { return new FinishStatement(statement) });
                }

                return _.chain(startedStatements)
                    .map(function (started) {
                        var finished = _.find(finishedStatements, function (item) { return item.attemptId === started.attemptId });
                        return finished ? new FinishStatement(finished) : new StartedStatement(started);
                    })
                    .sortBy(function (statement) { return -statement.lrsStatement.date; })
                    .value();
            }

            function loadStatements(entityId, take, skip) {
                return Q.fcall(function () {
                    if (!that.allResultsLoaded && (that.loadedResults.length <= take + skip)) {
                        return loadLrsStatements(entityId, take + 1, skip)
                            // load +1 record to determine should we show 'Show more' button or not.
                            .then(function (statements) {
                                if (statements && statements.length < take + 1) {
                                    that.allResultsLoaded = true;
                                }
                                Array.prototype.splice.apply(that.loadedResults, [skip, take].concat(statements));
                                return statements.slice(0, take);
                            });
                    }
                    return that.loadedResults.slice(skip, skip + take);
                });
            }

            function loadAllStatements(entityId) {
                return Q.fcall(function () {
                    if (that.allResultsLoaded) {
                        return that.loadedResults;
                    }

                    return loadLrsStatements(entityId)
                        .then(function (statements) {
                            that.loadedResults = statements;
                            that.allResultsLoaded = true;
                            return that.loadedResults;
                        });
                });
            }

            function getResultsFileName() {
                var filename = ['results_',
                    that.entityTitle.replace(/[^\w\s_-]/gi, '').trim(),
                    '_',
                    moment().format('YYYY-MM-DD_hh-mm'),
                    '.csv'].join('');

                return filename;
            }

            function generateResultsCsvBlob() {
                var passed = localizationManager.localize('passed');
                var failed = localizationManager.localize('failed');
                var inProgress = localizationManager.localize('inProgress');
                var noScore = localizationManager.localize('reportingScoreNotAvailable');
                var notFinished = localizationManager.localize('reportingNotFinished');

                var nameHeader = localizationManager.localize('nameAndEmail');
                var resultHeader = localizationManager.localize('result');
                var scoreHeader = localizationManager.localize('score');
                var dateHeader = localizationManager.localize('date');
                var timeHeader = localizationManager.localize('time');
                var csvHeader = [
                    nameHeader,
                    resultHeader,
                    scoreHeader,
                    dateHeader,
                    timeHeader
                ].join(',');
                var csvList = [csvHeader];

                return loadAllStatements(that.entityId).then(function (reportingStatements) {
                    _.each(reportingStatements, function (result) {
                        var resultCsv = [
                            result.lrsStatement.actor.name + ' (' + result.lrsStatement.actor.email + ')',
                            result instanceof StartedStatement ? inProgress : result.passed ? passed : failed,
                            result.hasScore ? result.lrsStatement.score : noScore,
                            result instanceof StartedStatement ? notFinished : moment(result.lrsStatement.date).format('YYYY-MM-D'),
                            result instanceof StartedStatement ? notFinished : moment(result.lrsStatement.date).format('h:mm:ss a')
                        ].join(',');

                        csvList.push(resultCsv);
                    });

                    var contentType = 'text/csv';

                    return new Blob([window.BOMSymbol || '\ufeff', csvList.join('\r\n')], { encoding: 'UTF-8', type: contentType });
                });
            }
        }

        return viewModel;
    }
);
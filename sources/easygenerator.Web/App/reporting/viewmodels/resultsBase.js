define(['constants', 'userContext', 'localization/localizationManager', 'eventTracker', 'utils/fileSaverWrapper', 'widgets/upgradeDialog/viewmodel', 'reporting/viewmodels/startedStatement', 'reporting/viewmodels/finishStatement'],
    function (constants, userContext, localizationManager, eventTracker, fileSaverWrapper, upgradeDialog, StartedStatement, FinishStatement) {
        "use strict";

        var viewModel = function (getEntity, getLrsStatements, noResultsViewLocation, generateDetailedResults) {
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
            that.allEmbededResultsLoaded = false;
            that.cachedResultsForDownload = null,
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
                        return undefined;
                    }
                    if (that.cachedResultsForDownload) {
                        return fileSaverWrapper.saveAs(generateResultsCsvBlob(that.cachedResultsForDownload), getResultsFileName());
                    }

                    var generateCsvTablePromise = generateDetailedResults ? generateDetailedCsv() : generateCsv();
                    return generateCsvTablePromise.then(function (csvTable) {
                        that.cachedResultsForDownload = csvTable;
                        return fileSaverWrapper.saveAs(generateResultsCsvBlob(csvTable), getResultsFileName());
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
                that.allEmbededResultsLoaded = false;
                that.cachedResultsForDownload = null;
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
                    return _.map(finishedStatements, function (statement) { return new FinishStatement(statement) });
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

            function loadAllEmbededStatements(statements) {
                return Q.fcall(function () {
                    if (that.allEmbededResultsLoaded) {
                        return statements;
                    }

                    var loadMasteredStatementsPromises = [];
                    _.forEach(statements, function (statement) {
                        if (statement instanceof FinishStatement) {
                            loadMasteredStatementsPromises.push(statement.load());
                        }
                    });
                    return Q.all(loadMasteredStatementsPromises).then(function () {
                        var loadAnsweredStatementsPromises = [];
                        _.forEach(statements, function (statement) {
                            if (statement instanceof FinishStatement) {
                                _.forEach(statement.children(), function (objectiveStatement) {
                                    loadAnsweredStatementsPromises.push(objectiveStatement.load());
                                });
                            }
                        });
                        return Q.all(loadAnsweredStatementsPromises).then(function () {
                            that.allEmbededResultsLoaded = true;
                            return statements;
                        });
                    });
                });
            }

            function generateCsv() {
                var passed = localizationManager.localize('passed');
                var failed = localizationManager.localize('failed');
                var inProgress = localizationManager.localize('inProgress');
                var noScore = localizationManager.localize('reportingInfoNotAvailable');
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
                ];

                var csvList = [generateCsvRow(csvHeader)];

                return loadAllStatements(that.entityId).then(function (reportingStatements) {
                    _.each(reportingStatements, function (result) {
                        var resultCsv = generateCsvRow([
                            result.learnerDisplayName,
                            result instanceof StartedStatement ? inProgress : result.passed ? passed : failed,
                            result.hasScore ? result.lrsStatement.score : noScore,
                            result instanceof StartedStatement ? notFinished : moment(result.lrsStatement.date).format('YYYY-MM-D'),
                            result instanceof StartedStatement ? notFinished : moment(result.lrsStatement.date).format('h:mm:ss a')
                        ]);

                        csvList.push(resultCsv);
                    });

                    return generateCsvTable(csvList);
                });
            }

            function generateDetailedCsv() {
                var passed = localizationManager.localize('passed');
                var failed = localizationManager.localize('failed');
                var inProgress = localizationManager.localize('inProgress');
                var noScore = localizationManager.localize('reportingInfoNotAvailable');
                var notFinished = localizationManager.localize('reportingNotFinished');

                var nameHeader = localizationManager.localize('nameAndEmail');
                var courseResultHeader = localizationManager.localize('courseResult');
                var courseScoreHeader = localizationManager.localize('courseScore');
                var startedDateHeader = localizationManager.localize('startedDate');
                var finishedDateHeader = localizationManager.localize('finishedDate');
                var startedTimeHeader = localizationManager.localize('startedTime');
                var finishedTimeHeader = localizationManager.localize('finishedTime');

                var objectiveTitleHeader = localizationManager.localize('objectiveTitle');
                var objectiveScoreHeader = localizationManager.localize('objectiveScore');

                var questionTitleHeader = localizationManager.localize('questionTitle');
                var questionResultHeader = localizationManager.localize('questionResult');
                var questionScoreHeader = localizationManager.localize('questionScore');
                var givenAnswerHeader = localizationManager.localize('givenAnswer');

                var emptyCellSymbol = '-';

                var courseCsvHeader = [
                    nameHeader,
                    courseResultHeader,
                    courseScoreHeader,
                    startedDateHeader,
                    startedTimeHeader,
                    finishedDateHeader,
                    finishedTimeHeader
                ];

                var objectiveCsvHeader = [
                    objectiveTitleHeader,
                    objectiveScoreHeader
                ];

                var questionCsvHeader = [
                    questionTitleHeader,
                    questionResultHeader,
                    questionScoreHeader,
                    givenAnswerHeader
                ];

                var courseResultRightPart = [];
                _(objectiveCsvHeader.length + questionCsvHeader.length).times(function () { courseResultRightPart.push(emptyCellSymbol); });

                var csvList = [generateCsvRow(courseCsvHeader.concat(objectiveCsvHeader).concat(questionCsvHeader))];

                return loadAllStatements(that.entityId).then(function (statements) {
                    return loadAllEmbededStatements(statements).then(function (reportingStatements) {
                        _.each(reportingStatements, function (result) {
                            var courseResultCsv = generateCsvRow([
                                result.learnerDisplayName,
                                result instanceof StartedStatement ? inProgress : result.passed ? passed : failed,
                                result.hasScore ? result.lrsStatement.score : noScore,
                                moment(result instanceof StartedStatement ? result.lrsStatement.date : result.startedLrsStatement.date).format('YYYY-MM-D'),
                                moment(result instanceof StartedStatement ? result.lrsStatement.date : result.startedLrsStatement.date).format('h:mm:ss a'),
                                result instanceof StartedStatement ? notFinished : moment(result.lrsStatement.date).format('YYYY-MM-D'),
                                result instanceof StartedStatement ? notFinished : moment(result.lrsStatement.date).format('h:mm:ss a')
                            ].concat(courseResultRightPart));

                            csvList.push(courseResultCsv);

                            pushEmbededResults(result, csvList, courseCsvHeader.length, objectiveCsvHeader.length, questionCsvHeader.length, emptyCellSymbol, noScore);
                        });

                        return generateCsvTable(csvList);
                    });
                });
            }

            function pushEmbededResults(result, csvList, courseColumnsNumber, objectiveColumnsNumber, questionColumnsNumber, emptyCellSymbol, noScoreMessage) {
                if (!result.children || !result.children().length) {
                    return;
                }

                var correct = localizationManager.localize('correctAnswer');
                var incorrect = localizationManager.localize('incorrectAnswer');

                var objectiveResultLeftPart = [];
                var objectiveResultRightPart = [];
                var questionResultLeftPart = [];

                _(courseColumnsNumber).times(function () { objectiveResultLeftPart.push(emptyCellSymbol); });
                _(questionColumnsNumber).times(function () { objectiveResultRightPart.push(emptyCellSymbol); });
                _(courseColumnsNumber + objectiveColumnsNumber).times(function () { questionResultLeftPart.push(emptyCellSymbol); });

                _.forEach(result.children(), function (objectiveResult) {

                    var objectiveResultCsv = generateCsvRow(objectiveResultLeftPart.concat([
                        objectiveResult.lrsStatement.name,
                        objectiveResult.hasScore ? objectiveResult.lrsStatement.score : noScoreMessage
                    ]).concat(objectiveResultRightPart));

                    csvList.push(objectiveResultCsv);

                    if (!objectiveResult.children || !objectiveResult.children().length) {
                        return;
                    }
                    _.forEach(objectiveResult.children(), function (questionResult) {
                        var questionResultCsv = generateCsvRow(questionResultLeftPart.concat([
                            questionResult.lrsStatement.name,
                            questionResult.hasAnswer && !questionResult.hasScore ? noScoreMessage : questionResult.correct ? correct : incorrect,
                            questionResult.hasScore ? questionResult.lrsStatement.score : noScoreMessage,
                            questionResult.hasAnswer && !questionResult.hasScore ? questionResult.lrsStatement.response : emptyCellSymbol
                        ]));
                        csvList.push(questionResultCsv);
                    });
                });
            }

            function generateCsvRow(columns) {
                return _.map(columns, function (column) {
                    return column.toString().replace(/"/g, '""');
                }).join(String.fromCharCode(11));
            }

            function generateCsvTable(csvList) {
                return csvList.join(String.fromCharCode(0)).split(String.fromCharCode(0)).join('"\r\n"').split(String.fromCharCode(11)).join('","');
            }

            function generateResultsCsvBlob(csvTable) {
                var contentType = 'text/csv';
                return new Blob([window.BOMSymbol || '\ufeff', csvTable], { encoding: 'UTF-8', type: contentType });
            }

            function getResultsFileName() {
                var filename = ['results_',
                    that.entityTitle.replace(/[^\w\s_-]/gi, '').trim(),
                    '_',
                    moment().format('YYYY-MM-DD_hh-mm'),
                    '.csv'].join('');

                return filename;
            }

        }

        return viewModel;
    }
);
define(['constants', 'moment', 'userContext', 'localization/localizationManager', 'eventTracker', 'utils/fileSaverWrapper', 'widgets/upgradeDialog/viewmodel',
 './startedStatement', './progressedStatement', 'reporting/viewmodels/questionStatements/answeredStatement', 'reporting/viewmodels/questionStatements/experiencedStatement', 'reporting/statementsCacheManager'],
    function (constants, moment, userContext, localizationManager, eventTracker, fileSaverWrapper, upgradeDialog, StartedStatement, ProgressedStatement, AnsweredStatement, ExperiencedStatement, statementsCacheManager) {
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
            that.allDetailedResultsLoaded = false;
            that.cachedResultsForDownload = null;
            that.isLoading = ko.observable(true);
            that.noResultsViewLocation = noResultsViewLocation;
            that.isPreparing = ko.observable(false);

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
                that.isPreparing(true);

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
                        
                        return fileSaverWrapper.saveAs(generateResultsCsvBlob(csvTable), getResultsFileName())                            
                    });
                }).fin(function () {
                    that.isPreparing(false);
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
                that.allDetailedResultsLoaded = false;
                that.cachedResultsForDownload = null;
                return getEntity(entityId).then(function (entity) {
                    that.entityTitle = entity.title;
                });
            }

            that.viewUrl = 'reporting/views/results';

            that.extendStatement = function (statement) {
                statement.isProgressed = statement instanceof ProgressedStatement;
                return statement;
            }

            function loadLrsStatements(entityId, embeded, take, skip, progressedHistory) {
                return getLrsStatements({ entityId: entityId, embeded: embeded, take: take, skip: skip, progressedHistory: progressedHistory });
            }

            function loadStatements(entityId, take, skip) {
                return Q.fcall(function () {
                    if (!that.allResultsLoaded && (that.loadedResults.length <= take + skip)) {
                        return loadLrsStatements(entityId, false, take + 1, skip)
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

            function loadAllDetailedStatements(entityId) {
                return Q.fcall(function () {
                    if (that.allDetailedResultsLoaded) {
                        return that.loadedResults;
                    }

                    return loadLrsStatements(entityId, true, null, null, true).then(function (statements) {
                        statementsCacheManager.applyLoadedChanges(that.results(), statements);
                        that.loadedResults = statementsCacheManager.clearProgressedHistory(statements);
                        that.allResultsLoaded = true;
                        that.allDetailedResultsLoaded = true;

                        return that.loadedResults;
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
                            result.learnerDisplayName + (result.learnerAccountHomePage ? ' from ' + result.learnerAccountHomePage : ''),
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
                var passed = localizationManager.localize('passed'),
                    failed = localizationManager.localize('failed'),
                    inProgress = localizationManager.localize('inProgress'),
                    noScore = localizationManager.localize('reportingInfoNotAvailable'),
                    notFinished = localizationManager.localize('reportingNotFinished'),

                    nameHeader = localizationManager.localize('nameAndEmail'),
                    courseResultHeader = localizationManager.localize('courseResult'),
                    courseScoreHeader = localizationManager.localize('courseScore'),
                    startedDateHeader = localizationManager.localize('startedDate'),
                    finishedDateHeader = localizationManager.localize('finishedDate'),
                    startedTimeHeader = localizationManager.localize('startedTime'),
                    finishedTimeHeader = localizationManager.localize('finishedTime'),

                    sectionTitleHeader = localizationManager.localize('section'),
                    sectionScoreHeader = localizationManager.localize('sectionScore'),

                    questionTitleHeader = localizationManager.localize('questionTitle'),
                    questionResultHeader = localizationManager.localize('questionResult'),
                    questionScoreHeader = localizationManager.localize('questionScore'),
                    givenAnswerHeader = localizationManager.localize('givenAnswer'),

                    contentTitleHeader = localizationManager.localize('learningContent'),
                    contentExperiencedHeader = localizationManager.localize('contentExperienced');

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

                var sectionCsvHeader = [
                    sectionTitleHeader,
                    sectionScoreHeader
                ];

                var questionCsvHeader = [
                    questionTitleHeader,
                    questionResultHeader,
                    questionScoreHeader,
                    givenAnswerHeader
                ];

                var contentCsvHeaders = [
                    contentTitleHeader,
                    contentExperiencedHeader
                ];

                var courseResultRightPart = [];
                _(sectionCsvHeader.length + questionCsvHeader.length + contentCsvHeaders.length).times(function () { courseResultRightPart.push(emptyCellSymbol); });

                var csvList = [generateCsvRow(courseCsvHeader.concat(sectionCsvHeader).concat(questionCsvHeader).concat(contentCsvHeaders))];

                return loadAllDetailedStatements(that.entityId).then(function (statements) {
                    _.each(statements, function (result) {
                        var courseResultCsv = generateCsvRow([
                            result.learnerDisplayName + (result.learnerAccountHomePage ? ' from ' + result.learnerAccountHomePage : ''),
                            result instanceof StartedStatement ? inProgress : result.isFinished ? result.passed ? passed : failed : inProgress,
                            result.hasScore ? result.lrsStatement.score : noScore,
                            result instanceof StartedStatement ? moment(result.lrsStatement.date).format('YYYY-MM-D') : result.startedLrsStatement ? moment(result.startedLrsStatement.date).format('YYYY-MM-D') : noScore,
                            result instanceof StartedStatement ? moment(result.lrsStatement.date).format('h:mm:ss a') : result.startedLrsStatement ? moment(result.startedLrsStatement.date).format('h:mm:ss a') : noScore,
                            result instanceof StartedStatement ? notFinished : result.isFinished ? moment(result.lrsStatement.date).format('YYYY-MM-D') : notFinished,
                            result instanceof StartedStatement ? notFinished : result.isFinished ? moment(result.lrsStatement.date).format('h:mm:ss a') : notFinished
                        ].concat(courseResultRightPart));
                        csvList.push(courseResultCsv);

                        pushEmbededResults(result, csvList, courseCsvHeader.length, sectionCsvHeader.length, questionCsvHeader.length, contentCsvHeaders.length, emptyCellSymbol, noScore);
                    });

                    return generateCsvTable(csvList);
                });
            }

            function pushEmbededResults(result, csvList, courseColumnsNumber, sectionColumnsNumber, questionColumnsNumber, contentColumnsLength, emptyCellSymbol, noScoreMessage) {
                if (!result.children || !result.children().length) {
                    return;
                }

                var correct = localizationManager.localize('correctAnswer'),
                    incorrect = localizationManager.localize('incorrectAnswer'),
                    statementTrue = localizationManager.localize('statementTrue').toUpperCase(),
                    statementFalse = localizationManager.localize('statementFalse').toUpperCase();

                var sectionResultLeftPart = [],
                    sectionResultRightPart = [],
                    questionResultLeftPart = [],
                    questionResultRightPart = [],
                    contentResultLeftPart = [];

                _(courseColumnsNumber).times(function () { sectionResultLeftPart.push(emptyCellSymbol); });
                _(questionColumnsNumber + contentColumnsLength).times(function () { sectionResultRightPart.push(emptyCellSymbol); });
                _(courseColumnsNumber + sectionColumnsNumber).times(function () { questionResultLeftPart.push(emptyCellSymbol); });
                _(contentColumnsLength).times(function () { questionResultRightPart.push(emptyCellSymbol); });
                _(courseColumnsNumber + sectionColumnsNumber + questionColumnsNumber).times(function () { contentResultLeftPart.push(emptyCellSymbol); });

                _.forEach(result.children(), function (sectionResult) {

                    var sectionResultCsv = generateCsvRow(sectionResultLeftPart.concat([
                        sectionResult.lrsStatement.name,
                        sectionResult.hasScore ? sectionResult.lrsStatement.score : noScoreMessage
                    ]).concat(sectionResultRightPart));

                    csvList.push(sectionResultCsv);

                    if (!sectionResult.children || !sectionResult.children().length) {
                        return;
                    }
                    _.forEach(sectionResult.children(), function (questionResult) {
                        if (questionResult instanceof AnsweredStatement) {
                            var questionAnsweredResultCsv = generateCsvRow(questionResultLeftPart.concat([
                                questionResult.lrsStatement.name,
                                questionResult.hasAnswer && !questionResult.hasScore ? noScoreMessage : questionResult.correct ? correct : incorrect,
                                questionResult.hasScore ? questionResult.lrsStatement.score : noScoreMessage,
                                questionResult.hasAnswer && !questionResult.hasScore ? questionResult.csvResponse : emptyCellSymbol
                            ]).concat(questionResultRightPart));
                            csvList.push(questionAnsweredResultCsv);

                        } else if (questionResult instanceof ExperiencedStatement) {
                            var questionExperiencedResultCsv = generateCsvRow(contentResultLeftPart.concat([
                               questionResult.lrsStatement.name,
                               questionResult.lrsStatement.score === 100 ? statementTrue : statementFalse
                            ]));
                            csvList.push(questionExperiencedResultCsv);
                        }
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
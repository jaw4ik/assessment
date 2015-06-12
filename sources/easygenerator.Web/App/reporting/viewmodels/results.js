define([
        'repositories/courseRepository', 'plugins/router', 'constants', 'repositories/courseRepository', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker',
        'reporting/xApiProvider', 'plugins/dialog', 'utils/fileSaverWrapper', 'reporting/viewmodels/courseStatement',
        'widgets/upgradeDialog/viewmodel'
],
    function (repository, router, constants, courseRepository, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, xApiProvider, dialog, fileSaverWrapper, CourseStatement, upgradeDialog) {
        "use strict";

        var events = {
                navigateToCourses: 'Navigate to courses',
                showMoreResults: 'Show more results',
                downloadResults: 'Download results'
            };

        var viewModel = {
            courseId: '',
            courseTitle: '',
            loadedResults: [],
            pageNumber: 1,

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate,
            deactivate: deactivate,
            attached: attached,

            allResultsLoaded: false,
            isLoading: ko.observable(true),
            results: ko.observableArray([]),
            showMoreResults: showMoreResults,
            downloadResults: downloadResults,
            getResultsFileName: getResultsFileName,
            generateResultsCsvBlob: generateResultsCsvBlob
        };

        viewModel.noResults = ko.computed(function () {
            return viewModel.results().length === 0;
        });

        viewModel.hasMoreResults = ko.computed(function () {
            return viewModel.results().length < viewModel.loadedResults.length;
        });

        return viewModel;

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

        function activate(courseId) {
            viewModel.results([]);
            viewModel.loadedResults = [];
            viewModel.pageNumber = 1;
            viewModel.courseId = courseId;
            viewModel.allResultsLoaded = false;

            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseTitle = course.title;
            });
        }

        function deactivate() {
            viewModel.results([]);
            viewModel.loadedResults = [];
        }

        function loadStatements(courseId, take, skip) {
            return Q.fcall(function () {
                if (!viewModel.allResultsLoaded && (viewModel.loadedResults.length <= take + skip)) {
                    return xApiProvider.getCourseCompletedStatements(courseId, take + 1, skip)
                        // load +1 record to determine should we show 'Show more' button or not.
                        .then(function (reportingStatements) {
                            var courseStatements = _.map(reportingStatements, function (statement) {
                                return new CourseStatement(statement);
                            });
                            if (courseStatements && courseStatements.length < take + 1) {
                                viewModel.allResultsLoaded = true;
                            }
                            Array.prototype.splice.apply(viewModel.loadedResults, [skip, take].concat(courseStatements));
                            return courseStatements.slice(0, take);
                        });
                }
                return viewModel.loadedResults.slice(skip, skip + take);
            });
        }

        function loadAllStatements(courseId) {
            return Q.fcall(function () {
                if (!viewModel.allResultsLoaded) {
                    return xApiProvider.getCourseCompletedStatements(courseId)
                        .then(function (reportingStatements) {
                            viewModel.loadedResults = _.map(reportingStatements, function (statement) {
                                return new CourseStatement(statement);
                            });
                            viewModel.allResultsLoaded = true;
                            return viewModel.loadedResults;
                        });
                }
                return viewModel.loadedResults;
            });
        }


        function attached() {
            viewModel.isLoading(true);
            return loadStatements(viewModel.courseId, constants.courseResults.pageSize, 0)
                .then(function (reportingStatements) {
                    viewModel.results.push.apply(viewModel.results, reportingStatements);
                }).fin(function () {
                    viewModel.isLoading(false);
                });
        }

        function showMoreResults() {
            eventTracker.publish(events.showMoreResults);
            return Q.fcall(function () {
                if (!viewModel.hasMoreResults()) {
                    return undefined;
                }
                if (!userContext.hasStarterAccess()) {
                    var settings = {
                        containerCss: 'upgrade-dialog-all-results',
                        eventCategory: 'Load more results',
                        subtitleKey: 'resultsUpgradeDialogTitle2',
                        descriptionKey: 'resultsUpgradeDialogText'
                    };

                    upgradeDialog.show(settings);
                    return undefined;
                }

                return loadStatements(viewModel.courseId, constants.courseResults.pageSize, viewModel.pageNumber * constants.courseResults.pageSize)
                    .then(function (reportingStatements) {
                        viewModel.results.push.apply(viewModel.results, reportingStatements);
                        viewModel.pageNumber++;
                    });
            });
        }

        function downloadResults() {
            eventTracker.publish(events.downloadResults);
            return Q.fcall(function () {
                if (!userContext.hasStarterAccess()) {
                    var settings = {
                        containerCss: 'upgrade-dialog-download-results',
                        eventCategory: 'Download results CSV',
                        subtitleKey: 'resultsUpgradeForDownloadCSVDialogTitle2',
                        descriptionKey: 'resultsUpgradeForDownloadCSVDialogHtml'
                    };

                    upgradeDialog.show(settings);
                    return;
                }

                var name = getResultsFileName();
                generateResultsCsvBlob().then(function (blob) {
                    fileSaverWrapper.saveAs(blob, name);
                });
            });
        }

        function getResultsFileName() {
            var filename = ['results_',
                viewModel.courseTitle.replace(/[^\w\s_-]/gi, '').trim(),
                '_',
                moment().format('YYYY-MM-DD_hh-mm'),
                '.csv'].join('');

            return filename;
        }

        function generateResultsCsvBlob() {
            var passed = localizationManager.localize('passed');
            var failed = localizationManager.localize('failed');

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

            return loadAllStatements(viewModel.courseId).then(function (reportingStatements) {
                _.each(reportingStatements, function (result) {
                    var resultCsv = [
                        result.lrsStatement.actor.name + ' (' + result.lrsStatement.actor.email + ')',
                        result.passed ? passed : failed,
                        result.lrsStatement.score,
                        moment(result.lrsStatement.date).format('YYYY-MM-D'),
                        moment(result.lrsStatement.date).format('h:mm:ss a')
                    ].join(',');

                    csvList.push(resultCsv);
                });

                var contentType = 'text/csv';

                return new Blob([window.top.BOMSymbol || '\ufeff', csvList.join('\r\n')], { encoding: 'UTF-8', type: contentType });
            });
        }
    }
);
define([
        'repositories/courseRepository', 'plugins/router', 'constants', 'repositories/courseRepository', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker',
        'reporting/xApiProvider', 'plugins/dialog', 'viewmodels/reporting/courseStatement'
],
    function (repository, router, constants, courseRepository, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, xApiProvider, dialog, CourseStatement) {
        "use strict";
        "use strict";

        var loadMoreEventCategory = 'Load more results',
            downloadAsCsvEventCategory = 'Download results CSV',
            events = {
                navigateToCourses: 'Navigate to courses',
                showMoreResults: 'Show more results',
                downloadResults: 'Download results',
                upgradeNow: 'Upgrade now',
                skipUpgrade: 'Skip upgrade'
            };

        var viewModel = {
            courseId: '',
            courseTitle: '',
            loadedResults: [],
            pageNumber: 1,

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate,
            attached: attached,

            isLoading: ko.observable(true),
            results: ko.observableArray([]),
            isResultsDialogShown: ko.observable(false),
            isDownloadDialogShown: ko.observable(false),
            getLearnerName: getLearnerName,
            showMoreResults: showMoreResults,
            upgradeNowForLoadMore: upgradeNowForLoadMore,
            upgradeNowForDownloadCsv: upgradeNowForDownloadCsv,
            skipUpgradeForLoadMore: skipUpgradeForLoadMore,
            skipUpgradeForDownloadCsv: skipUpgradeForDownloadCsv,
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
            viewModel.isResultsDialogShown(false);
            viewModel.isDownloadDialogShown(false);
            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseTitle = course.title;
            });
        }

        function loadStatements(courseId, take, skip) {
            return Q.fcall(function () {
                var startIndex = skip ? skip + 1 : 0;
                if (viewModel.loadedResults.length <= take + skip || (!take && !skip)) {
                    var toTake = take ? take + 1 : null; // load +1 record to determine should we show 'Show more' button or not.
                    return xApiProvider.getCourseCompletedStatements(courseId, toTake, skip)
                        .then(function (reportingStatements) {
                            var courseStatements = _.map(reportingStatements, function (statement) {
                                return new CourseStatement(statement);
                            });
                            Array.prototype.splice.apply(viewModel.loadedResults, [startIndex, 0].concat(courseStatements));
                            return courseStatements.slice(0, take);
                        });
                }
                return viewModel.loadedResults.slice(startIndex, startIndex + take);
            });
        }

        function attached() {
            viewModel.isLoading(true);
            return loadStatements(viewModel.courseId, constants.courseResults.pageSize, 0)
                .then(function (reportingStatements) {
                viewModel.results.push.apply(viewModel.results, reportingStatements);
                }).fail(function(reason) {
            }).fin(function () {
                    viewModel.isLoading(false);
                });
        }

        function getLearnerName(reportingStatement) {
            return reportingStatement.lrsStatement.actor.name + ' (' + reportingStatement.lrsStatement.actor.email + ')';
        }

        function showMoreResults() {
            eventTracker.publish(events.showMoreResults);

            if (!viewModel.hasMoreResults()) {
                return;
            }

            if (!userContext.hasStarterAccess()) {
                viewModel.isResultsDialogShown(true);
                return;
            }

            viewModel.pageNumber++;

            loadStatements(viewModel.courseId, constants.courseResults.pageSize, viewModel.pageNumber * constants.courseResults.pageSize)
                .then(function (reportingStatements) {
                    Array.prototype.push.apply(viewModel.results, reportingStatements);
                });
        }

        function upgradeNowForLoadMore() {
            upgradeNow(loadMoreEventCategory);
            viewModel.isResultsDialogShown(false);
        }

        function upgradeNowForDownloadCsv() {
            upgradeNow(downloadAsCsvEventCategory);
            viewModel.isDownloadDialogShown(false);
        }

        function upgradeNow(eventCategory) {
            eventTracker.publish(events.upgradeNow, eventCategory);
            router.openUrl(constants.upgradeUrl);
        }

        function skipUpgradeForLoadMore() {
            skipUpgrade(loadMoreEventCategory);
            viewModel.isResultsDialogShown(false);
        }

        function skipUpgradeForDownloadCsv() {
            skipUpgrade(downloadAsCsvEventCategory);
            viewModel.isDownloadDialogShown(false);
        }

        function skipUpgrade(eventCategory) {
            eventTracker.publish(events.skipUpgrade, eventCategory);
        }

        function downloadResults() {
            eventTracker.publish(events.downloadResults);

            if (!userContext.hasStarterAccess()) {
                viewModel.isDownloadDialogShown(true);
                return;
            }

            var name = getResultsFileName();
            generateResultsCsvBlob().then(function (blob) {
                saveAs(blob, name);
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

            return loadStatements(viewModel.courseId).then(function (reportingStatements) {
                _.each(reportingStatements, function (result) {
                    var resultCsv = [
                        result.lrsStatement.actor.name + ' (' + result.lrsStatement.actor.email + ')',
                        result.lrsStatement.correct ? passed : failed,
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
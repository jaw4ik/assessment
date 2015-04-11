define(['repositories/courseRepository', 'plugins/router', 'constants', 'repositories/courseRepository', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker',
        'reporting/xApiProvider', 'plugins/dialog'],
    function (repository, router, constants, courseRepository, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, xApiProvider, dialog) {
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

        function attached() {
            viewModel.isLoading(true);
            return xApiProvider.getReportingStatements(viewModel.courseId).then(function (reportingStatements) {
                viewModel.loadedResults = _.sortBy(reportingStatements, function (reportingStatement) {
                    return -reportingStatement.date;
                });

                viewModel.results(_.chain(viewModel.loadedResults).first(viewModel.pageNumber * constants.courseResults.pageSize).value());
            }).fin(function () {
                viewModel.isLoading(false);
            });
        }

        function getLearnerName(reportingStatement) {
            return reportingStatement.name + ' (' + reportingStatement.email + ')';
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
            var resultsToShow = _.chain(viewModel.loadedResults)
                .first(viewModel.pageNumber * constants.courseResults.pageSize)
                .last(constants.courseResults.pageSize)
                .value();
            viewModel.results(_.union(viewModel.results(), resultsToShow));
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
            saveAs(generateResultsCsvBlob(), name);
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
            _.each(viewModel.loadedResults, function (result) {
                var resultCsv = [
                    result.name + '(' + result.email + ')',
                    result.correct ? passed : failed,
                    result.score,
                    moment(result.date).format('YYYY-MM-d'),
                    moment(result.date).format('h:mm:ss a')
                ].join(',');

                csvList.push(resultCsv);
            });

            var contentType = 'text/csv';

            return new Blob([window.top.BOMSymbol || '\ufeff', csvList.join('\r\n')], { encoding: 'UTF-8', type: contentType });
        }
    }
);
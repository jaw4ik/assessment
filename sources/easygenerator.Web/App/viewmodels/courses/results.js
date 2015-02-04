define(['repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker', 'ping', 'models/backButton',
        'reporting/xApiProvider', 'plugins/dialog'],
    function (repository, router, constants, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, ping, BackButton, xApiProvider, dialog) {
        "use strict";

        var eventCategory = 'Load more results',
            events = {
                navigateToCourses: 'Navigate to courses',
                showMoreResults: 'Show more results',
                upgradeNow: 'Upgrade now',
                skipUpgrade: 'Skip upgrade'
            };

        var viewModel = {
            courseId: '',
            loadedResults: [],
            pageNumber: 1,

            navigateToCoursesEvent: navigateToCoursesEvent,

            canActivate: canActivate,
            activate: activate,
            attached: attached,

            backButtonData: new BackButton({
                url: 'courses',
                backViewName: localizationManager.localize('courses'),
                callback: navigateToCoursesEvent
            }),

            isLoading: ko.observable(true),
            results: ko.observableArray([]),
            isResultsDialogShown: ko.observable(false),
            getLearnerName: getLearnerName,
            showMoreResults: showMoreResults,
            upgradeNow: upgradeNow,
            skipUpgrage: skipUpgrage
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

        function canActivate() {
            return ping.execute();
        }

        function activate(courseId) {
            viewModel.results([]);
            viewModel.loadedResults = [];
            viewModel.pageNumber = 1;
            viewModel.courseId = courseId;
            viewModel.isResultsDialogShown(false);
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

        function upgradeNow() {
            eventTracker.publish(events.upgradeNow, eventCategory);
            viewModel.isResultsDialogShown(false);
            router.openUrl(constants.upgradeUrl);
        };

        function skipUpgrage() {
            eventTracker.publish(events.skipUpgrade, eventCategory);
            viewModel.isResultsDialogShown(false);
        };

    }
);
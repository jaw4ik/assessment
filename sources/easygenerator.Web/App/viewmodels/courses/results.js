define(['repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker', 'ping', 'models/backButton',
        'reporting/xApiProvider'],
    function (repository, router, constants, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, ping, BackButton, xApiProvider) {

        var events = {
            navigateToCourses: 'Navigate to courses'
        };

        var viewModel = {
            courseId: '',
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
            getLearnerName: getLearnerName
        };

        viewModel.noResults = ko.computed(function() {
            return viewModel.results().length === 0;
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
            viewModel.courseId = courseId;
        }

        function attached() {
            viewModel.isLoading(true);
            return xApiProvider.getReportingStatements(viewModel.courseId).then(function (reportingStatements) {
                viewModel.results(_.sortBy(reportingStatements, function (reportingStatement) {
                    return -reportingStatement.date;
                }));
            }).fin(function () {
                viewModel.isLoading(false);
            });
        }

        function getLearnerName(reportingStatement) {
            return reportingStatement.name + ' (' + reportingStatement.email + ')';
        }
    }
);
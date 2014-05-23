define(['viewmodels/courses/collaboration/collaborators', 'viewmodels/objectives/objectiveBrief',
    'eventTracker', 'plugins/router', 'viewmodels/common/contentField'],
    function (collaboratorsViewModel, objectiveBriefViewModel, eventTracker, router, contentFieldViewModel) {
        "use strict";

        var events = {
            navigateToObjectiveDetails: 'Navigate to objective details'
        };

        var eventsForCourseContent = {
            addContent: 'Define introduction',
            beginEditText: 'Start editing introduction',
            endEditText: 'End editing introduction'
        };

        var viewModel = {
            id: '',
            title: '',
            connectedObjectives: [],
            courseIntroductionContent: {},
            collaborators: null,

            initialize: initialize,
            navigateToObjectiveDetails: navigateToObjectiveDetails
        };

        return viewModel;

        function initialize(course) {
            viewModel.id = course.id;
            viewModel.title = course.title;
            viewModel.collaborators = new collaboratorsViewModel(course.id, course.createdBy, course.collaborators);

            viewModel.courseIntroductionContent = contentFieldViewModel(course.introductionContent, eventsForCourseContent, false, function (content) {
                return true;
            });

            viewModel.connectedObjectives = _.chain(course.objectives).map(function (objective) {
                return objectiveBriefViewModel(objective);
            }).value();
        }

        function navigateToObjectiveDetails(objective) {
            eventTracker.publish(events.navigateToObjectiveDetails);
            if (_.isUndefined(objective)) {
                throw 'Objective is undefined';
            }

            if (_.isNull(objective)) {
                throw 'Objective is null';
            }

            if (_.isUndefined(objective.id)) {
                throw 'Objective does not have id property';
            }

            if (_.isNull(objective.id)) {
                throw 'Objective id property is null';
            }

            router.navigate('objective/' + objective.id + '?courseId=' + viewModel.id);
        }

    }
);
define([
    'durandal/app',
    'eventTracker',
    'plugins/router',
    'constants',
    'authorization/limitCoursesAmount',
    'treeOfContent/handlers/treeOfContentEventHandler',
    'treeOfContent/handlers/treeOfContentAutoExpandHandler',
    'treeOfContent/handlers/treeOfContentHighlightHandler',
    'repositories/courseRepository',
    'treeOfContent/CourseTreeNode',

    'text!treeOfContent/CourseTreeNode.html',
    'text!treeOfContent/RelatedObjectiveTreeNode.html',
    'text!treeOfContent/QuestionTreeNode.html'],

function (app, eventTracker, router, constants, limitCoursesAmount, treeOfContentEventHandler, treeOfContentAutoExpandHandler, treeOfContentHighlightHandler, courseRepository, CourseTreeNode) {

        var viewModel = {
            children: ko.observableArray([]),
            isExpanded: ko.observable(true),
            isTreeVisible: ko.observable(true),
            isCreateCourseAvailable: ko.observable(true),

            checkLimitCoursesAmount: checkLimitCoursesAmount,

            expand: expand,
            collapse: collapse,
            onCollapsed: onCollapsed,

            activate: activate,
            compositionComplete: compositionComplete,

            navigateToCreateCourse: navigateToCreateCourse
        };

        function expand() {
            eventTracker.publish('Expand navigation bar');
            viewModel.isExpanded(true);
            viewModel.isTreeVisible(true);
            app.trigger(constants.messages.treeOfContent.expanded);
        }

        function collapse() {
            eventTracker.publish('Collapse navigation bar');
            viewModel.isExpanded(false);
            app.trigger(constants.messages.treeOfContent.collapsed);
        }

        function onCollapsed() {
            viewModel.isTreeVisible(false);
        }

        function checkLimitCoursesAmount() {
            viewModel.isCreateCourseAvailable(limitCoursesAmount.checkAccess());
        }


        var self = {
            handler: treeOfContentEventHandler()
        };

        app.on(constants.messages.question.created, self.handler.questionCreated);
        app.on(constants.messages.question.deleted, self.handler.questionsDeleted);
        app.on(constants.messages.question.titleUpdated, self.handler.questionTitleUpdated);

        app.on(constants.messages.objective.titleUpdated, self.handler.objectiveTitleUpdated);
        app.on(constants.messages.objective.questionsReordered, self.handler.questionsReordered);

        app.on(constants.messages.course.created, self.handler.courseCreated);
        app.on(constants.messages.course.deleted, self.handler.courseDeleted);
        app.on(constants.messages.course.titleUpdated, self.handler.courseTitleUpdated);
        app.on(constants.messages.course.objectivesRelated, self.handler.objectivesRelated);
        app.on(constants.messages.course.objectivesUnrelated, self.handler.objectivesUnrelated);
        app.on(constants.messages.course.objectivesReordered, self.handler.objectivesReordered);

        app.on(constants.messages.user.identified, viewModel.checkLimitCoursesAmount);
        app.on(constants.messages.course.created, viewModel.checkLimitCoursesAmount);
        app.on(constants.messages.course.deleted, viewModel.checkLimitCoursesAmount);

        router.routeData.subscribe(function (navigationContext) {
            treeOfContentAutoExpandHandler.handle(viewModel, navigationContext).then(function () {
                treeOfContentHighlightHandler.handle();
            });
        });

        return viewModel;

        function activate() {

            return courseRepository.getCollection().then(function (courses) {

                var array = _.chain(courses)
                    .sortBy(function (course) { return -course.createdOn; })
                    .map(function (course) { return new CourseTreeNode(course.id, course.title, '#course/' + course.id); })
                    .value();

                viewModel.children(array);

                return treeOfContentAutoExpandHandler.handle(viewModel, router.routeData());
            });
        }

        function compositionComplete() {
            treeOfContentHighlightHandler.handle();
            viewModel.checkLimitCoursesAmount();
        }

        function navigateToCreateCourse() {
            eventTracker.publish('Navigate to create course', 'Tree of content');
            router.navigate('course/create');
        }

});
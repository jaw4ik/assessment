define([
    'durandal/app',
    'plugins/router',
    'treeOfContent/handlers/treeOfContentEventHandler',
    'treeOfContent/handlers/treeOfContentAutoExpandHandler',
    'treeOfContent/handlers/treeOfContentHighlightHandler',
    'repositories/courseRepository',
    'treeOfContent/CourseTreeNode',

    'text!treeOfContent/CourseTreeNode.html',
    'text!treeOfContent/RelatedObjectiveTreeNode.html',
    'text!treeOfContent/QuestionTreeNode.html'],

    function (app, router, treeOfContentEventHandler, treeOfContentAutoExpandHandler, treeOfContentHighlightHandler, courseRepository, CourseTreeNode) {

        var viewModel = {
            children: ko.observableArray([]),
            isExpanded: ko.observable(false),
            isTreeVisible: ko.observable(false),

            expand: expand,
            collapse: collapse,
            onCollapsed: onCollapsed,

            activate: activate,
            compositionComplete: compositionComplete
        };

        function expand() {
            viewModel.isExpanded(true);
            viewModel.isTreeVisible(true);
        }

        function collapse() {
            viewModel.isExpanded(false);
        }

        function onCollapsed() {
            viewModel.isTreeVisible(false);
        }

        var self = {
            handler: treeOfContentEventHandler()
        };

        app.on('question:created', self.handler.questionCreated);
        app.on('questions:deleted', self.handler.questionsDeleted);
        app.on('question:titleUpdated', self.handler.questionTitleUpdated);

        app.on('objective:titleUpdated', self.handler.objectiveTitleUpdated);
        app.on('objective:questionsReordered', self.handler.questionsReordered);

        app.on('course:created', self.handler.courseCreated);
        app.on('course:deleted', self.handler.courseDeleted);
        app.on('course:titleUpdated', self.handler.courseTitleUpdated);
        app.on('course:objectivesRelated', self.handler.objectivesRelated);
        app.on('course:objectivesUnrelated', self.handler.objectivesUnrelated);
        app.on('course:objectivesReordered', self.handler.objectivesReordered);

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
        }

    })
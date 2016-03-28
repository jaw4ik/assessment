define([
    'durandal/app',
    'eventTracker',
    'plugins/router',
    'constants',
    'authorization/limitCoursesAmount',
    './handlers/treeOfContentEventHandler',
    './handlers/treeOfContentAutoExpandHandler',
    './handlers/treeOfContentHighlightHandler',
    'repositories/courseRepository',
    './CourseTreeNode',
    'userContext'
],

function (app, eventTracker, router, constants, limitCoursesAmount, treeOfContentEventHandler, treeOfContentAutoExpandHandler, treeOfContentHighlightHandler, courseRepository, CourseTreeNode, userContext) {

    var viewModel = {
        children: ko.observableArray([]),
        sharedChildren: ko.observableArray(),

        activate: activate,
        compositionComplete: compositionComplete
    };

    var self = {
        handler: treeOfContentEventHandler()
    };

    app.on(constants.messages.question.created, self.handler.questionCreated);
    app.on(constants.messages.question.createdByCollaborator, self.handler.questionCreated);
    app.on(constants.messages.question.deleted, self.handler.questionsDeleted);
    app.on(constants.messages.question.deletedByCollaborator, self.handler.questionsDeleted);
    app.on(constants.messages.question.titleUpdated, self.handler.questionTitleUpdated);
    app.on(constants.messages.question.titleUpdatedByCollaborator, self.handler.questionTitleUpdated);

    app.on(constants.messages.section.titleUpdated, self.handler.sectionTitleUpdated);
    app.on(constants.messages.section.titleUpdatedByCollaborator, self.handler.sectionTitleUpdated);
    app.on(constants.messages.section.questionsReordered, self.handler.questionsReordered);
    app.on(constants.messages.section.questionsReorderedByCollaborator, self.handler.questionsReordered);

    app.on(constants.messages.course.created, self.handler.courseCreated);
    app.on(constants.messages.course.deleted, self.handler.courseDeleted);
    app.on(constants.messages.course.deletedByCollaborator, self.handler.courseDeletedByCollaborator);
    app.on(constants.messages.course.titleUpdated, self.handler.courseTitleUpdated);
    app.on(constants.messages.course.titleUpdatedByCollaborator, self.handler.courseTitleUpdated);
    app.on(constants.messages.course.sectionRelated, self.handler.sectionRelated);
    app.on(constants.messages.course.sectionRelatedByCollaborator, self.handler.sectionRelated);
    app.on(constants.messages.course.sectionsUnrelated, self.handler.sectionsUnrelated);
    app.on(constants.messages.course.sectionsUnrelatedByCollaborator, self.handler.sectionsUnrelated);
    app.on(constants.messages.course.sectionsReordered, self.handler.sectionsReordered);
    app.on(constants.messages.course.sectionsReorderedByCollaborator, self.handler.sectionsReordered);

    app.on(constants.messages.course.collaboration.started, self.handler.collaborationStarted);
    app.on(constants.messages.course.collaboration.finished, self.handler.collaborationFinished);
    app.on(constants.messages.course.collaboration.finishedByCollaborator, self.handler.collaborationFinished);

    router.routeData.subscribe(function (navigationContext) {
        treeOfContentAutoExpandHandler.handle(viewModel, navigationContext).then(function () {
            treeOfContentHighlightHandler.handle();
        });
    });

    return viewModel;

    function activate() {

        return courseRepository.getCollection().then(function (courses) {
            var userEmail = userContext.identity.email;

            viewModel.children(mapCourses(_.filter(courses, function (course) {
                return course.createdBy == userEmail;
            })));
            
            viewModel.sharedChildren(mapCourses(_.filter(courses, function (course) {
                return course.createdBy != userEmail;
            })));

            return treeOfContentAutoExpandHandler.handle(viewModel, router.routeData());
        });
    }

    function mapCourses(courses) {
        return _.chain(courses)
                .sortBy(function (course) { return -course.createdOn; })
                .map(function (course) { return new CourseTreeNode(course.id, course.title, '#courses/' + course.id, course.createdOn); })
                .value();
    }

    function compositionComplete() {
        treeOfContentHighlightHandler.handle();
    }
});
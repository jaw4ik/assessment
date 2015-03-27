define(['plugins/router', 'viewmodels/courses/index', 'repositories/courseRepository', 'eventTracker', 'notify', 'constants', 'dialogs/collaboration/collaboration', 'dialogs/publishCourse/publishCourse'], function (router, index, repository, eventTracker, notify, constants, addCollaboratorDialog, vmPublishCourse) {

    // VIEWMODEL COURSE INDEX

    var events = {
        updateCourseTitle: 'Update course title',
        previewCourse: 'Preview course'
    };

    var childRouter = index.router.createChildRouter()
      .makeRelative({
          fromParent: true,
          dynamicHash: ':courseId'
      }).map([
          { route: 'design', moduleId: 'viewmodels/courses/course/design', title: 'Design', nav: 2, hash: '#courses/:courseId/design' },
          { route: 'publish', moduleId: 'viewmodels/courses/course/publish', title: 'Publish', nav: 3, hash: '#courses/:courseId/publish' },
          { route: 'results', moduleId: 'viewmodels/courses/course/results', title: 'Results', nav: 4, hash: '#courses/:courseId/results' },

          { route: ['', '*details'], moduleId: 'viewmodels/courses/course/create/index', title: 'Create', nav: 1, hash: '#courses/:courseId' }
      ]).buildNavigationModel();


    childRouter.isViewReady = ko.observable(false);


    childRouter.isNavigating.subscribe(function (newValue) {
        console.log('isNavigating: ' + newValue);
    });

    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        console.warn('router:navigation:processing  -  course/course/index');
    });


    //childRouter.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
    //    router.isViewReady(true);
    //});


    var viewModel = {
        router: childRouter,

        courseId: undefined,

        title: ko.observable(),
        courseTitleMaxLength: constants.validation.courseTitleMaxLength,
        createdBy: ko.observable(),

        activate: function (courseId) {
            console.warn('viewmodels/courses/course/index');
            return repository.getById(courseId).then(function (course) {
                viewModel.id = course.id;
                viewModel.title(course.title);
                viewModel.createdBy(course.createdBy);
            });

        },
        collaboration: addCollaboratorDialog,
        addMember: function () {
            addCollaboratorDialog.show(viewModel.id, viewModel.createdBy());
        },

        preview: preview,
        share: share
    };

    viewModel.title.isEditing = ko.observable();

    viewModel.title.beginEdit = function () {
        viewModel.title.isEditing(true);
    }

    viewModel.title.endEdit = function () {
        var that = viewModel.title;

        that(that() && that().trim());
        that.isEditing(false);

        repository.getById(viewModel.id).then(function (response) {
            if (that() === response.title) {
                return;
            }

            eventTracker.publish(events.updateCourseTitle);

            if (that.isValid()) {
                repository.updateCourseTitle(viewModel.id, that()).then(notify.saved);
            } else {
                that(response.title);
            }
        });
    }

    viewModel.title.isValid = ko.computed(function () {
        var length = viewModel.title() ? viewModel.title().trim().length : 0;
        return length > 0 && length <= constants.validation.courseTitleMaxLength;
    });

    return viewModel;


    function preview() {
        eventTracker.publish(events.previewCourse);
        router.openUrl('/preview/' + viewModel.id);
    }

    function share() {
        vmPublishCourse.show(viewModel.id);
    }


})
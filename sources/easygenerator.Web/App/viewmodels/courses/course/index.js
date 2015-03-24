define(['viewmodels/courses/index', 'repositories/courseRepository', 'eventTracker', 'constants'], function (index, repository, eventTracker, constants) {

    // VIEWMODEL COURSE INDEX

    var events = {
        updateCourseTitle: 'Update course title'
    };

    var childRouter = index.router.createChildRouter()
      .makeRelative({
          fromParent: true,
          dynamicHash: ':courseId'
      }).map([
          { route: 'design', moduleId: 'viewmodels/courses/course/design', title: 'Design', nav: 2 },
          { route: 'publish', moduleId: 'viewmodels/courses/course/publish', title: 'Publish', nav: 3 },
          { route: 'results', moduleId: 'viewmodels/courses/course/results', title: 'Results', nav: 4 },

          { route: ['', '*details'], moduleId: 'viewmodels/courses/course/create/index', title: 'Create', nav: 1 }
      ]).buildNavigationModel();


    childRouter.isViewReady = ko.observable(false);

    var fragment;

    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        if (instruction.fragment.indexOf(fragment) === -1 || fragment.length === 0) {
            router.isViewReady(false);
        }
        fragment = instruction.fragment;
    });


    childRouter.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
        router.isViewReady(true);
    });


    var viewModel = {
        router: childRouter,

        courseId: undefined,

        title: ko.observable(),
        isEditing: ko.observable(),
        startEditTitle: startEditTitle,
        endEditTitle: endEditTitle,
        courseTitleMaxLength: constants.validation.courseTitleMaxLength,

        activate: function (courseId) {
            console.info("ACTIVATE COURSE VIEWMODEL " + courseId);
            return repository.getById(courseId).then(function (course) {
                viewModel.id = course.id;
                viewModel.title(course.title);
            });

        }
    };

    viewModel.title.isValid = ko.computed(function () {
        var length = viewModel.title() ? viewModel.title().trim().length : 0;
        return length > 0 && length <= constants.validation.courseTitleMaxLength;
    });

    return viewModel;


    function startEditTitle() {
        viewModel.isEditing(true);
    }

    function endEditTitle() {
        viewModel.title(viewModel.title().trim());
        viewModel.isEditing(false);

        repository.getById(viewModel.id).then(function (response) {
            if (viewModel.title() === response.title) {
                return;
            }

            eventTracker.publish(events.updateCourseTitle);

            if (viewModel.title.isValid()) {
                repository.updateCourseTitle(viewModel.id, viewModel.title()).then(notify.saved);
            } else {
                viewModel.title(response.title);
            }
        });
    }

})
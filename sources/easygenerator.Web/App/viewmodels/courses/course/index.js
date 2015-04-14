define(['durandal/app', 'plugins/router', 'viewmodels/courses/index', 'repositories/courseRepository', 'repositories/collaboratorRepository', 'userContext', 'clientContext', 'eventTracker', 'notify', 'constants', 'dialogs/collaboration/collaboration', 'dialogs/publishCourse/publishCourse'], function (app, router, index, repository, collaboratorRepository, userContext, clientContext, eventTracker, notify, constants, collaborationPopup, sharePopup) {

    var events = {
        updateCourseTitle: 'Update course title',
        previewCourse: 'Preview course'
    };

    //#region Router setup
    var childRouter = index.router.createChildRouter()
      .makeRelative({
          fromParent: true,
          dynamicHash: ':courseId'
      }).map([
          {
              route: 'design',
              moduleId: 'viewmodels/courses/course/design',
              title: 'courseDesignItem',
              nav: 2,
              hash: '#courses/:courseId/design',
              settings: {
                  localizationKey: 'courseDesignItem'
              },
              navigate: function () {
                  eventTracker.publish('Navigate to design course');
                  router.navigate(this.dynamicHash());
              }
          },
          {
              route: 'publish',
              moduleId: 'viewmodels/courses/course/publish',
              title: 'coursePublishItem',
              nav: 3,
              hash: '#courses/:courseId/publish',
              settings: {
                  localizationKey: 'course'
              },
              navigate: function () {
                  eventTracker.publish('Navigate to publish course');
                  router.navigate(this.dynamicHash());
              }
          },
          {
              route: 'results',
              moduleId: 'viewmodels/courses/course/results',
              title: 'courseResultsItem',
              nav: 4,
              hash: '#courses/:courseId/results',
              settings: {
                  localizationKey: 'course'
              },
              navigate: function () {
                  eventTracker.publish('Navigate to results');
                  router.navigate(this.dynamicHash());
              }
          },
          {
              route: ['', '*details'],
              moduleId: 'viewmodels/courses/course/create/index',
              title: 'courseCreateItem',
              nav: 1,
              hash: '#courses/:courseId',
              settings: {
                  localizationKey: 'course'
              },
              navigate: function () {
                  eventTracker.publish('Navigate to create course');
                  router.navigate(this.dynamicHash());
              }
          }
      ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();


    childRouter.isViewReady = ko.observable();
    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        if (instruction.config.moduleId !== router.isViewReady()) {
            router.isViewReady(false);
        }
    });
    childRouter.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
        if (instance) {
            setTimeout(function () {
                router.isViewReady(instance.__moduleId__);
            }, 250);
        }
    });

    //#endregion

    var viewModel = {
        router: childRouter,

        id: '',
        title: ko.observable(),
        createdBy: ko.observable(),

        collaborators: ko.observableArray(),
        collaborate: collaborate,
        preview: preview,
        share: share,

        canActivate: canActivate,
        activate: activate,
        deactivate: deactivate,

        titleUpdated: titleUpdated,
        collaboratorAdded: collaboratorAdded,
        collaboratorRemoved: collaboratorRemoved

    };

    viewModel.title.maxLength = constants.validation.courseTitleMaxLength;

    viewModel.title.isEditing = ko.observable();
    viewModel.title.isSelected = ko.observable();

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
        return length > 0 && length <= viewModel.title.maxLength;
    });

    collaborate.enabled = ko.computed(function () {
        return (userContext.identity && userContext.identity.email) === viewModel.createdBy();
    });

    return viewModel;

    function collaborate() {
        collaborationPopup.show(viewModel.id, viewModel.createdBy());
    }

    function preview() {
        eventTracker.publish(events.previewCourse);
        router.openUrl('/preview/' + viewModel.id);
    }

    function share() {
        sharePopup.show(viewModel.id);
    }

    function canActivate(courseId) {
        return repository.getById(courseId).then(function () {
            return true;
        }).catch(function () {
            return { redirect: '404' };
        });

    }

    function activate(courseId) {
        return repository.getById(courseId).then(function (course) {
            viewModel.id = course.id;
            viewModel.title(course.title);
            viewModel.createdBy(course.createdBy);

            clientContext.set(constants.clientContextKeys.lastVistedCourse, course.id);
            clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);

            viewModel.title.isSelected(clientContext.get(constants.clientContextKeys.lastCreatedCourseId) === course.id);
            clientContext.remove(constants.clientContextKeys.lastCreatedCourseId);

            return collaboratorRepository.getCollection(courseId).then(function (collection) {
                app.on(constants.messages.course.collaboration.collaboratorAdded + courseId, collaboratorAdded);
                app.on(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaboratorRemoved);

                app.on(constants.messages.course.titleUpdatedByCollaborator, viewModel.titleUpdated);

                viewModel.collaborators(collection.map(function (collaborator) {
                    return collaborator.email;
                }));
            });
        });
    }

    function deactivate() {
        app.off(constants.messages.course.collaboration.collaboratorAdded + viewModel.id, collaboratorAdded);
        app.off(constants.messages.course.collaboration.collaboratorRemoved + viewModel.id, collaboratorRemoved);

        app.off(constants.messages.course.titleUpdatedByCollaborator, viewModel.titleUpdated);
    }

    function collaboratorAdded(collaborator) {
        if (!_.find(viewModel.collaborators(), function (item) {
            return item === collaborator.email;
        })) {
            viewModel.collaborators.push(collaborator.email);
        }
    }

    function collaboratorRemoved(collaboratorEmail) {
        viewModel.collaborators(_.without(viewModel.collaborators(), collaboratorEmail));
    }

    function titleUpdated(course) {
        if (course.id !== viewModel.id || viewModel.title.isEditing()) {
            return;
        }

        viewModel.title(course.title);
    }
})
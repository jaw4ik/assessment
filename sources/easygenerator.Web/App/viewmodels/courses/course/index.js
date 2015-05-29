define(['durandal/app', 'plugins/router', 'routing/isViewReadyMixin', 'viewmodels/courses/index', 'repositories/courseRepository', 'repositories/collaboratorRepository',
    'userContext', 'clientContext', 'eventTracker', 'notify', 'constants', 'localization/localizationManager', 'dialogs/collaboration/collaboration',
    'dialogs/publishCourse/publishCourse', 'viewmodels/common/titleField'],
    function (app, router, isViewReady, index, repository, collaboratorRepository, userContext, clientContext, eventTracker, notify, constants, localizationManager,
        collaborationPopup, sharePopup, titleField) {

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
                  title: localizationManager.localize('courseDesignItem'),
                  nav: 2,
                  hash: '#courses/:courseId/design',
                  navigate: function () {
                      eventTracker.publish('Navigate to design course');
                      router.navigate(this.dynamicHash());
                  }
              },
              {
                  route: 'configure',
                  moduleId: 'viewmodels/courses/course/configure',
                  title: localizationManager.localize('courseConfigureItem'),
                  nav: 3,
                  hash: '#courses/:courseId/configure',
                  navigate: function () {
                      eventTracker.publish('Navigate to configure course');
                      router.navigate(this.dynamicHash());
                  }
              },
              {
                  route: 'publish',
                  moduleId: 'viewmodels/courses/course/publish',
                  title: localizationManager.localize('coursePublishItem'),
                  nav: 4,
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
                  moduleId: 'reporting/viewmodels/results',
                  title: localizationManager.localize('courseResultsItem'),
                  nav: 5,
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
                  title: localizationManager.localize('courseCreateItem'),
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


        isViewReady.assign(childRouter);


        //#endregion

        var viewModel = {
            router: childRouter,

            id: '',
            createdBy: ko.observable(),
            isDirty: ko.observable(),

            collaborators: ko.observableArray(),
            collaborate: collaborate,
            preview: preview,
            share: share,

            canActivate: canActivate,
            activate: activate,
            deactivate: deactivate,

            titleUpdated: titleUpdated,
            collaboratorAdded: collaboratorAdded,
            collaboratorRemoved: collaboratorRemoved,
            stateChanged: stateChanged
        };

        viewModel.titleField = titleField('', constants.validation.courseTitleMaxLength, localizationManager.localize('courseTitle'), getTitle, updateTitle);

        collaborate.enabled = ko.computed(function () {
            return (userContext.identity && userContext.identity.email) === viewModel.createdBy();
        });

        return viewModel;

        function getTitle() {
            return repository.getById(viewModel.id).then(function (response) {
                return response.title;
            });
        }

        function updateTitle(title) {
            eventTracker.publish(events.updateCourseTitle);
            return repository.updateCourseTitle(viewModel.id, title);
        }

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
                viewModel.titleField.title(course.title);
                viewModel.createdBy(course.createdBy);
                viewModel.isDirty(course.isDirty);

                clientContext.set(constants.clientContextKeys.lastVistedCourse, course.id);
                clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);

                viewModel.titleField.isSelected(clientContext.get(constants.clientContextKeys.lastCreatedCourseId) === course.id);
                clientContext.remove(constants.clientContextKeys.lastCreatedCourseId);
                app.on(constants.messages.course.stateChanged + courseId, stateChanged);

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
            app.off(constants.messages.course.stateChanged + viewModel.id, stateChanged);
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
            if (course.id !== viewModel.id || viewModel.titleField.isEditing()) {
                return;
            }

            viewModel.titleField.title(course.title);
        }

        function stateChanged(state) {
            viewModel.isDirty(state.isDirty);
        }
    })
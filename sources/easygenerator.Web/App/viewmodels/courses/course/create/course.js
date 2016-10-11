define(['routing/router', 'constants', 'eventTracker', 'repositories/courseRepository', 'viewmodels/sections/sectionBrief',
        'localization/localizationManager', 'notify', 'repositories/sectionRepository', 'viewmodels/common/contentField',
        'userContext', 'durandal/app', 'imageUpload', 'commands/createSectionCommand'],
    function (router, constants, eventTracker, repository, sectionBrief, localizationManager, notify, sectionRepository, vmContentField, userContext, app, imageUpload, createSectionCommand) {
        "use strict";

        var
            events = {
                navigateToSectionDetails: 'Navigate to objective details',
                selectSection: 'Select Objective',
                unselectSection: 'Unselect Objective',
                updateCourseTitle: 'Update course title',
                showAllAvailableSections: 'Show all available objectives',
                connectSelectedSectionsToCourse: 'Connect selected objectives to course',
                showConnectedSections: 'Show connected objectives',
                unrelateSectionsFromCourse: 'Unrelate objectives from course',
                navigateToCourses: 'Navigate to courses',
                changeOrderSections: 'Change order of learning objectives',
                openChangeSectionImageDialog: 'Open "change objective image" dialog',
                changeSectionImage: 'Change objective image'
            },

            eventsForCourseContent = {
                addContent: 'Define introduction',
                beginEditText: 'Start editing introduction',
                endEditText: 'End editing introduction'
            },

            sectionsListModes = {
                appending: 'appending',
                display: 'display'
            };

        var viewModel = {
            id: '',
            createdBy: '',
            connectedSections: ko.observableArray([]),
            availableSections: ko.observableArray([]),
            sectionsMode: ko.observable(''),

            courseIntroductionContent: {},
            sectionsListModes: sectionsListModes,
            canDisconnectSections: ko.observable(false),
            canConnectSections: ko.observable(false),
            isReorderingSections: ko.observable(false),
            isSortingEnabled: ko.observable(true),

            isSectionsListReorderedByCollaborator: ko.observable(false),

            updateSectionImage: updateSectionImage,
            navigateToSectionDetails: navigateToSectionDetails,
            createSection: createSection,
            navigateToCoursesEvent: navigateToCoursesEvent,
            toggleSectionSelection: toggleSectionSelection,
            showAllAvailableSections: showAllAvailableSections,
            showConnectedSections: showConnectedSections,
            disconnectSelectedSections: disconnectSelectedSections,
            startReorderingSections: startReorderingSections,
            endReorderingSections: endReorderingSections,
            reorderSections: reorderSections,
            activate: activate,
            connectSection: connectSection,
            disconnectSection: disconnectSection,
            sectionDisconnected: sectionDisconnected,

            introductionContentUpdated: introductionContentUpdated,
            sectionsReordered: sectionsReordered,
            sectionConnected: sectionConnected,
            sectionsDisconnected: sectionsDisconnected,
            sectionTitleUpdated: sectionTitleUpdated,
            sectionImageUpdated: sectionImageUpdated,
            sectionUpdated: sectionUpdated,
            localizationManager: localizationManager,
            eventTracker: eventTracker
        };

        viewModel.canDisconnectSections = ko.computed(function () {
            return _.some(viewModel.connectedSections(), function (item) {
                return item.isSelected();
            });
        });

        viewModel.canConnectSections = ko.computed(function () {
            return _.some(viewModel.availableSections(), function (item) {
                return item.isSelected();
            });
        });

        viewModel.isSortingEnabled = ko.computed(function () {
            return viewModel.connectedSections().length !== 1;
        });

        app.on(constants.messages.course.titleUpdatedByCollaborator, viewModel.titleUpdated);
        app.on(constants.messages.course.introductionContentUpdatedByCollaborator, viewModel.introductionContentUpdated);
        app.on(constants.messages.course.sectionsReorderedByCollaborator, viewModel.sectionsReordered);
        app.on(constants.messages.course.sectionRelatedByCollaborator, viewModel.sectionConnected);
        app.on(constants.messages.course.sectionsUnrelatedByCollaborator, viewModel.sectionsDisconnected);
        app.on(constants.messages.section.titleUpdatedByCollaborator, viewModel.sectionTitleUpdated);
        app.on(constants.messages.section.imageUrlUpdatedByCollaborator, viewModel.sectionImageUpdated);
        app.on(constants.messages.section.modified, viewModel.sectionUpdated);

        return viewModel;

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

        function updateSectionImage(section) {
            eventTracker.publish(events.openChangeSectionImageDialog);
            imageUpload.upload({
                startLoading: function () {
                    section.isImageLoading(true);
                },
                success: function (url) {
                    sectionRepository.updateImage(section.id, url).then(function (result) {
                        section.imageUrl(result.imageUrl);
                        section.isImageLoading(false);
                        eventTracker.publish(events.changeSectionImage);
                        notify.saved();
                    });
                },
                error: function () {
                    section.isImageLoading(false);
                }
            });
        }

        function navigateToSectionDetails(section) {
            eventTracker.publish(events.navigateToSectionDetails);
            if (_.isUndefined(section)) {
                throw 'Section is undefined';
            }

            if (_.isNull(section)) {
                throw 'Section is null';
            }

            if (_.isUndefined(section.id)) {
                throw 'Section does not have id property';
            }

            if (_.isNull(section.id)) {
                throw 'Section id property is null';
            }

            router.navigate('courses/' + viewModel.id + '/sections/' + section.id);
        }

        function createSection() {
            createSectionCommand.execute(viewModel.id);
        }

        function toggleSectionSelection(section) {
            if (_.isUndefined(section)) {
                throw 'Section is undefined';
            }

            if (_.isNull(section)) {
                throw 'Section is null';
            }

            if (!ko.isObservable(section.isSelected)) {
                throw 'Section does not have isSelected observable';
            }

            if (section.isSelected()) {
                eventTracker.publish(events.unselectSection);
                section.isSelected(false);
            } else {
                eventTracker.publish(events.selectSection);
                section.isSelected(true);
            }
        }

        function showAllAvailableSections() {
            if (viewModel.sectionsMode() === sectionsListModes.appending) {
                return;
            }

            eventTracker.publish(events.showAllAvailableSections);

            sectionRepository.getCollection().then(function (sectionsList) {
                var relatedIds = _.pluck(viewModel.connectedSections(), 'id');
                var sections = _.filter(sectionsList, function (item) {
                    return !_.include(relatedIds, item.id);
                });
                mapAvailableSections(sections);

                viewModel.sectionsMode(sectionsListModes.appending);
            });
        }

        function mapAvailableSections(sections) {
            viewModel.availableSections(_.chain(sections)
                    .filter(function (item) {
                        return item.createdBy === userContext.identity.email;
                    })
                    .sortBy(function (item) {
                        return -item.createdOn;
                    })
                    .map(function (item) {
                        var mappedSection = sectionBrief(item);
                        mappedSection._original = item;

                        return mappedSection;
                    })
                    .value());
        }

        function showConnectedSections() {
            if (viewModel.sectionsMode() === sectionsListModes.display) {
                return;
            }

            eventTracker.publish(events.showConnectedSections);

            _.each(viewModel.connectedSections(), function (item) {
                item.isSelected(false);
            });

            viewModel.sectionsMode(sectionsListModes.display);
        }

        function connectSection(section) {
            if (_.contains(viewModel.connectedSections(), section.item)) {
                var sections = _.map(viewModel.connectedSections(), function (item) {
                    return {
                        id: item.id
                    };
                });
                sections.splice(section.sourceIndex, 1);
                sections.splice(section.targetIndex, 0, { id: section.item.id });
                eventTracker.publish(events.changeOrderSections);
                repository.updateSectionOrder(viewModel.id, sections).then(function () {
                    notify.saved();
                });
                return;
            }

            eventTracker.publish(events.connectSelectedSectionsToCourse);
            repository.relateSection(viewModel.id, section.item.id, section.targetIndex).then(function () {
                notify.saved();
            });
        }

        function disconnectSection(section) {
            if (_.contains(viewModel.availableSections(), section.item)) {
                return;
            }

            eventTracker.publish(events.unrelateSectionsFromCourse);
            repository.unrelateSections(viewModel.id, [section.item]).then(function () {
                notify.saved();
            });
        }

        function sectionDisconnected(section) {
            if (section.item.createdBy != userContext.identity.email) {
                viewModel.availableSections(_.reject(viewModel.availableSections(), function (item) {
                    return item.id == section.item.id;
                }));
            }
        }

        function disconnectSelectedSections() {
            if (!viewModel.canDisconnectSections()) {
                return;
            }

            eventTracker.publish(events.unrelateSectionsFromCourse);

            var selectedSections = _.filter(viewModel.connectedSections(), function (item) {
                return item.isSelected();
            });

            repository.unrelateSections(viewModel.id, _.map(selectedSections, function (item) {
                return item;
            })).then(function () {
                viewModel.connectedSections(_.difference(viewModel.connectedSections(), selectedSections));
                notify.saved();
            });
        }

        function startReorderingSections() {
            viewModel.isReorderingSections(true);
        }

        function endReorderingSections() {
            return Q.fcall(function () {
                if (!viewModel.isReorderingSections() || !viewModel.isSectionsListReorderedByCollaborator()) {
                    viewModel.isReorderingSections(false);
                    return;
                }

                viewModel.isReorderingSections(false);
                viewModel.isSectionsListReorderedByCollaborator(false);

                return repository.getById(viewModel.id).then(function (course) {
                    reorderConnectedSectionsList(course);
                });
            });
        }

        function reorderSections() {
            eventTracker.publish(events.changeOrderSections);
            viewModel.isReorderingSections(false);
            repository.updateSectionOrder(viewModel.id, viewModel.connectedSections()).then(function () {
                notify.saved();
            });
        }

        function activate(courseId) {

            return repository.getById(courseId).then(function (course) {
                viewModel.id = course.id;
                viewModel.createdBy = course.createdBy;

                viewModel.sectionsMode(sectionsListModes.display);
                viewModel.connectedSections(_.chain(course.sections)
                    .map(function (section) {
                        return sectionBrief(section);
                    })
                    .value());

                viewModel.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, function (content) {
                    return repository.updateIntroductionContent(course.id, content);
                });

            });
        }

        function sectionTitleUpdated(section) {
            var vmSection = getSectionViewModel(section.id);

            if (_.isObject(vmSection)) {
                vmSection.title(section.title);
                vmSection.modifiedOn(section.modifiedOn);
            }
        }

        function sectionImageUpdated(section) {
            var vmSection = getSectionViewModel(section.id);

            if (_.isObject(vmSection)) {
                vmSection.imageUrl(section.image);
                vmSection.modifiedOn(section.modifiedOn);
            }
        }

        function sectionUpdated(section) {
            var vmSection = getSectionViewModel(section.id);

            if (_.isObject(vmSection)) {
                vmSection.modifiedOn(section.modifiedOn);
            }
        }

        function getSectionViewModel(sectionId) {
            var sections = viewModel.connectedSections().concat(viewModel.availableSections());

            return _.find(sections, function (item) {
                return item.id === sectionId;
            });
        }

        function introductionContentUpdated(course) {
            if (course.id !== viewModel.id) {
                return;
            }

            viewModel.courseIntroductionContent.originalText(course.introductionContent);
            if (!viewModel.courseIntroductionContent.isEditing()) {
                viewModel.courseIntroductionContent.text(course.introductionContent);
                viewModel.courseIntroductionContent.isEditing.valueHasMutated();
            }
        }

        function sectionsReordered(course) {
            if (viewModel.id !== course.id || viewModel.isReorderingSections()) {
                viewModel.isSectionsListReorderedByCollaborator(true);
                return;
            }

            reorderConnectedSectionsList(course);
        }

        function reorderConnectedSectionsList(course) {
            viewModel.connectedSections(_.chain(course.sections)
                  .map(function (section) {
                      return _.find(viewModel.connectedSections(), function (obj) {
                          return obj.id === section.id;
                      });
                  })
                  .value());
        }

        function sectionConnected(courseId, section, targetIndex) {
            if (viewModel.id !== courseId) {
                return;
            }

            var sections = viewModel.connectedSections();
            var isConnected = _.some(sections, function (item) {
                return item.id === section.id;
            });

            if (isConnected) {
                sections = _.reject(sections, function (item) {
                    return item.id === section.id;
                });
            }

            var vmSection = sectionBrief(section);
            if (!_.isNullOrUndefined(targetIndex)) {
                sections.splice(targetIndex, 0, vmSection);
            } else {
                sections.push(vmSection);
            }

            viewModel.connectedSections(sections);

            var availableSections = viewModel.availableSections();
            viewModel.availableSections(_.reject(availableSections, function (item) {
                return section.id === item.id;
            }));
        }

        function sectionsDisconnected(courseId, disconnectedSectionIds) {
            if (viewModel.id !== courseId) {
                return;
            }

            var connectedSections = viewModel.connectedSections();
            viewModel.connectedSections(_.reject(connectedSections, function (item) {
                return _.some(disconnectedSectionIds, function (id) {
                    return id === item.id;
                });
            }));

            sectionRepository.getCollection().then(function (sectionsList) {
                var relatedIds = _.pluck(viewModel.connectedSections(), 'id');
                var sections = _.filter(sectionsList, function (item) {
                    return !_.include(relatedIds, item.id);
                });
                mapAvailableSections(sections);
            });
        }

    }
);
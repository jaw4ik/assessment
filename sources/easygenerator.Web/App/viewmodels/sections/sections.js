define(['durandal/app', 'constants', 'eventTracker', 'routing/router', 'repositories/sectionRepository', 'repositories/courseRepository', 'notify', 'localization/localizationManager',
    'clientContext', 'userContext', 'viewmodels/sections/sectionBrief', 'images/commands/upload', 'commands/createSectionCommand'],
    function (app, constants, eventTracker, router, sectionRepository, courseRepository, notify, localizationManager, clientContext, userContext, sectionBrief, uploadImage, createSectionCommand) {
        "use strict";

        var
            events = {
                navigateToDetails: "Navigate to objective details",
                navigateToCourses: "Navigate to courses",
                selectSection: "Select Objective",
                unselectSection: "Unselect Objective",
                deleteSections: "Delete selected objectives",
                openChangeSectionImageDialog: "Open \"change objective image\" dialog",
                changeSectionImage: "Change objective image"
            };

        var viewModel = {
            sections: ko.observableArray([]),

            lastVisitedSection: '',
            currentLanguage: '',

            createSection: createSection,
            navigateToDetails: navigateToDetails,
            navigateToCourses: navigateToCourses,

            deleteSelectedSections: deleteSelectedSections,
            toggleSectionSelection: toggleSectionSelection,

            updateSectionImage: updateSectionImage,

            sectionTitleUpdated: sectionTitleUpdated,
            sectionImageUpdated: sectionImageUpdated,
            sectionUpdated: sectionUpdated,

            activate: activate
        };

        viewModel.enableDeleteSections = ko.computed(function () {
            return getSelectedSections().length > 0;
        });

        app.on(constants.messages.section.titleUpdatedByCollaborator, viewModel.sectionTitleUpdated);
        app.on(constants.messages.section.imageUrlUpdatedByCollaborator, viewModel.sectionImageUpdated);
        app.on(constants.messages.section.modified, viewModel.sectionUpdated);

        return viewModel;

        function createSection() {
            createSectionCommand.execute();
        }

        function navigateToDetails(item) {
            eventTracker.publish(events.navigateToDetails);
            router.navigate('library/sections/' + item.id);
        }

        function navigateToCourses() {
            eventTracker.publish(events.navigateToCourses);
            router.navigate('courses');
        }

        function updateSectionImage(file) {
            eventTracker.publish(events.openChangeSectionImageDialog);
            var that = this;
            that.isImageLoading(true);
            return uploadImage.execute(file)
                .then(function (image) {
                    return sectionRepository.updateImage(that.id, image.url).then(function (result) {
                        that.imageUrl(result.imageUrl);
                        that.isImageLoading(false);
                        eventTracker.publish(events.changeSectionImage);
                        notify.saved();
                    });
                }).catch(function (reason) {
                    that.isImageLoading(false);
                    notify.error(reason);
                });
        }

        function toggleSectionSelection(section) {
            if (_.isNullOrUndefined(section)) {
                throw 'Section is null or undefined';
            }

            if (!ko.isObservable(section.isSelected)) {
                throw 'Section does not have isSelected observable';
            }

            section.isSelected(!section.isSelected());
            eventTracker.publish(section.isSelected() ? events.selectSection : events.unselectSection);
        }

        function getSelectedSections() {
            return _.reject(viewModel.sections(), function (section) {
                return section.isSelected && !section.isSelected();
            });
        }

        function deleteSelectedSections() {
            eventTracker.publish(events.deleteSections);

            var selectedSections = getSelectedSections();
            if (selectedSections.length == 0) {
                throw "No selected sections to delete";
            }

            if (selectedSections.length > 1) {
                notify.error(localizationManager.localize('deleteSeveralSectionsError'));
                return undefined;
            }

            var selectedSection = selectedSections[0];

            if (!selectedSection.canBeDeleted) {
                notify.error(localizationManager.localize('sectionCannnotBeDeleted'));
                return undefined;
            }

            sectionRepository.removeSection(selectedSection.id).then(function () {
                viewModel.sections(_.reject(viewModel.sections(), function (section) {
                    return section.id === selectedSection.id;
                }));
                notify.saved();
            });
        }

        function sectionUpdated(section) {
            var vmSection = getSectionViewModel(section.id);

            if (_.isObject(vmSection)) {
                vmSection.modifiedOn(section.modifiedOn);
            }
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

        function getSectionViewModel(sectionId) {
            return _.find(viewModel.sections(), function (item) {
                return item.id === sectionId;
            });
        }

        function activate() {

            viewModel.lastVisitedSection = clientContext.get(constants.clientContextKeys.lastVisitedSection);
            clientContext.set(constants.clientContextKeys.lastVisitedSection, null);

            viewModel.currentLanguage = localizationManager.currentLanguage;

            return sectionRepository.getCollection().then(function (receivedSections) {
                return courseRepository.getCollection().then(function (courses) {
                    var includedSections = _.chain(courses).map(function (course) {
                        return course.sections;
                    }).flatten().uniq().value();
                    var array = _.chain(receivedSections)
                        .filter(function (item) { return item.createdBy == userContext.identity.email; })
                        .sortBy(function (item) { return -item.createdOn; })
                        .map(function (item) {
                            var mappedSection = sectionBrief(item);
                            mappedSection.canBeDeleted = (function (currentItem) {
 
                                return (!_.find(includedSections, function (section) {
                                    return section.id === currentItem.id;
                                }));
                            })(item);
                            return mappedSection;
                        }).value();

                    viewModel.sections(array);
                });
            });
        };


    });
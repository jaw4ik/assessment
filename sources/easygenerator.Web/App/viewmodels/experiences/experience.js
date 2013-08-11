define(['dataContext', 'durandal/plugins/router', 'constants', 'eventTracker', 'repositories/experienceRepository', 'services/buildExperience', 'viewmodels/objectives/objectiveBrief'],
    function (dataContext, router, constants, eventTracker, repository, service, objectiveBrief) {
        "use strict";

        var
            events = {
                category: 'Experience',
                buildExperience: 'Build experience',
                downloadExperience: 'Download experience',
                navigateToExperiences: 'Navigate to experiences',
                navigateToNextExperience: 'Navigate to next experience',
                navigateToPreviousExperience: 'Navigate to previous experience',
                navigateToObjectiveDetails: 'Navigate to Objective details',
                selectObjective: 'Select Objective',
                unselectObjective: 'Unselect Objective'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var
            id = '',
            title = '',
            objectives = [],
            status = ko.observable(),
            
            nextExperienceId = null,
            previousExperienceId = null,
            
            navigateToExperiences = function () {
                sendEvent(events.navigateToExperiences);
                router.navigateTo('#/experiences');
            },
            navigateToNextExperience = function () {
                sendEvent(events.navigateToNextExperience);
                if (_.isUndefined(this.nextExperienceId) || _.isNull(this.nextExperienceId)) {
                    router.navigateTo('#/404');
                } else {
                    router.navigateTo('#/experience/' + this.nextExperienceId);
                }
            },
            navigateToPreviousExperience = function () {
                sendEvent(events.navigateToPreviousExperience);
                if (_.isUndefined(this.previousExperienceId) || _.isNull(this.previousExperienceId)) {
                    router.navigateTo('#/404');
                } else {
                    router.navigateTo('#/experience/' + this.previousExperienceId);
                }
            },
            navigateToObjectiveDetails = function (objective) {
                sendEvent(events.navigateToObjectiveDetails);
                if (_.isUndefined(objective)) {
                    throw 'Objective is undefined';
                }
                if (_.isNull(objective)) {
                    throw 'Objective is null';
                }                
                if (_.isUndefined(objective.id)) {
                    throw 'Objective does not have id property';
                }                
                router.navigateTo('#/objective/' + objective.id);
            },
            
            toggleObjectiveSelection = function(objective) {
                if (_.isUndefined(objective)) {
                    throw 'Objective is undefined';
                }
                if (_.isNull(objective)) {
                    throw 'Objective is null';
                }
                if (!ko.isObservable(objective.isSelected)) {
                    throw 'Objective does not have isSelected observable';
                }
                
                if (objective.isSelected()) {
                    sendEvent(events.unselectObjective);
                    objective.isSelected(false);
                } else {
                    sendEvent(events.selectObjective);
                    objective.isSelected(true);
                }
            },

            buildExperience = function () {
                sendEvent(events.buildExperience);
                status(constants.buildingStatuses.inProgress);

                var that = this;
                return service.build(this.id)
                    .then(function(isSuccessful) {
                        if (isSuccessful) {
                            that.status(constants.buildingStatuses.succeed);
                        } else {
                            that.status(constants.buildingStatuses.failed);
                        }
                    });
            },

            downloadExperience = function () {
                sendEvent(events.downloadExperience);
                router.navigateTo('download/' + this.id + '.zip');
            },

            activate = function (routeData) {

                if (!_.isObject(routeData) || _.isUndefined(routeData.id)) {
                    router.navigateTo('#/400');
                    return undefined;
                }

                var that = this;
                return repository.getCollection().then(function (response) {
                    var experience = _.find(response, function (item) {
                        return item.id == routeData.id;
                    });

                    if (!_.isObject(experience)) {
                        router.navigateTo('#/404');
                        return;
                    }

                    that.status(experience.buildingStatus);

                    that.id = experience.id;
                    that.title = experience.title;
                    that.objectives = _.chain(experience.objectives)
                            .map(function (objective) {
                                return objectiveBrief(objective);
                            })
                            .sortBy(function (objective) { return objective.title.toLowerCase(); })
                            .value();
                   
                    var index = _.indexOf(response, experience);                    
                    that.previousExperienceId = index != 0 ? response[index - 1].id : null;                    
                    that.nextExperienceId = index != response.length - 1 ? response[index + 1].id : null;
                });
            };

        return {
            activate: activate,

            id: id,
            title: title,
            //template: 'Default',
            objectives: objectives,
            status: status,
            statuses: constants.buildingStatuses,

            nextExperienceId: nextExperienceId,
            previousExperienceId: previousExperienceId,

            navigateToExperiences: navigateToExperiences,
            navigateToNextExperience: navigateToNextExperience,
            navigateToPreviousExperience: navigateToPreviousExperience,
            navigateToObjectiveDetails: navigateToObjectiveDetails,

            toggleObjectiveSelection: toggleObjectiveSelection,

            buildExperience: buildExperience,
            downloadExperience: downloadExperience            
        };
    }
);
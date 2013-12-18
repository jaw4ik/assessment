define(['repositories/objectiveRepository', 'plugins/router', 'eventTracker', 'constants', 'notify', 'localization/localizationManager', 'repositories/experienceRepository'],
    function (objectiveRepository, router, eventTracker, constants, notify, localizationManager, experienceRepository) {

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                navigateToExperience: 'Navigate to experience',
                createAndNew: "Create learning objective and create new",
                createAndContinue: "Create learning objective and open it properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var title = ko.observable(''),
            goBackTooltip = '',
            goBackLink = '',
            contextExperienceId = null,
            contextExperienceTitle = null;
        
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.objectiveTitleMaxLength;
        });

        var isTitleEditing = ko.observable(false),

            navigateBack = function () {
                if (_.isString(this.contextExperienceId)) {
                    sendEvent(events.navigateToExperience);
                    router.navigate('experience/' + this.contextExperienceId);
                } else {
                    sendEvent(events.navigateToObjectives);
                    router.navigate('objectives');
                }
            },

            activate = function (queryParams) {
                var that = this;

                that.contextExperienceId = null;
                that.contextExperienceTitle = null;
                that.title('');

                if (!_.isNullOrUndefined(queryParams) && _.isString(queryParams.experienceId)) {
                    return experienceRepository.getById(queryParams.experienceId).then(function(experience) {
                        if (_.isNull(experience)) {
                            router.replace('404');
                            return;
                        }

                        that.contextExperienceId = experience.id;
                        that.contextExperienceTitle = experience.title;

                        that.goBackTooltip = localizationManager.localize('backTo') + ' \'' + experience.title + '\'';
                        that.goBackLink = '#experience/' + experience.id;
                    });
                }
                
                return Q.fcall(function () {
                    that.goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('learningObjectives');
                    that.goBackLink = '#objectives';
                });
            },

            createAndNew = function () {
                sendEvent(events.createAndNew);
                var that = this;
                createObjective.call(that, function (createdObjective) {
                    isTitleEditing(true);
                    notify.info(localizationManager.localize('savedAt') + ' ' + createdObjective.createdOn.toLocaleTimeString());
                });
            },

            createAndContinue = function () {
                sendEvent(events.createAndContinue);
                var that = this;
                createObjective.call(that, function (createdObjective) {
                    var navigateUrl = 'objective/' + createdObjective.id;
                    if (_.isString(that.contextExperienceId)) {
                        router.navigateWithQueryString(navigateUrl);
                    } else {
                        router.navigate(navigateUrl);
                    }
                });
            };

        function createObjective(callback) {
            title(title().trim());

            if (!title.isValid()) {
                return;
            }
            
            var that = this;
            notify.lockContent();
            objectiveRepository.addObjective({ title: title() }).then(function (createdObjective) {
                title('');
                notify.unlockContent();
                
                if (_.isString(that.contextExperienceId)) {
                    objectiveRepository.getById(createdObjective.id).then(function (objective) {
                        experienceRepository.relateObjectives(that.contextExperienceId, [objective]).then(function () {
                            callback(createdObjective);
                        });
                    });
                } else {
                    callback(createdObjective);
                }
            });
        }

        return {
            title: title,
            contextExperienceId: contextExperienceId,
            contextExperienceTitle: contextExperienceTitle,
            objectiveTitleMaxLength: constants.validation.objectiveTitleMaxLength,
            isTitleEditing: isTitleEditing,

            goBackTooltip: goBackTooltip,
            goBackLink: goBackLink,

            activate: activate,
            navigateBack: navigateBack,
            createAndNew: createAndNew,
            createAndContinue: createAndContinue
        };
    }
);
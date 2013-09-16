define(['dataContext', 'constants', 'plugins/http', 'models/experience', 'guard', 'httpWrapper'],
    function (dataContext, constants, http, ExperienceModel, guard, httpWrapper) {

        var getCollection = function () {
            var deferred = Q.defer();

            deferred.resolve(dataContext.experiences);

            return deferred.promise;
        },
            getById = function (id) {
                var deferred = Q.defer();

                var result = _.find(dataContext.experiences, function (item) {
                    return item.id === id;
                });

                if (typeof result !== "undefined") {
                    deferred.resolve(result);
                } else {
                    deferred.reject('Experience not exist');
                }

                return deferred.promise;
            },
            addExperience = function (experience) {
                return Q.fcall(function () {
                    guard.throwIfNotAnObject(experience, 'Experience id is not an object');

                    return httpWrapper.post('api/experience/create', experience)
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.Id, 'Response Id is not a string');
                            guard.throwIfNotString(response.CreatedOn, 'Response CreatedOn is not a string');

                            var template = _.find(dataContext.templates, function (item) {
                                return item.id === experience.template.id;
                            });

                            guard.throwIfNotAnObject(template, 'Template does not exist in dataContext');

                            var experienceId = response.Id,
                                createdOn = response.CreatedOn;
                            dataContext.experiences.push(new ExperienceModel({
                                id: experienceId,
                                title: experience.title,
                                template: { id: template.id, name: template.name, image: template.image },
                                objectives: [],
                                buildingStatus: constants.buildingStatuses.notStarted,
                                createdOn: new Date(parseInt(createdOn.substr(6), 10)),
                                modifiedOn: new Date(parseInt(createdOn.substr(6), 10))
                            }));
                            return experienceId;
                        });
                });
            },
            removeExperience = function (experienceId) {
                var deferred = Q.defer();

                if (!_.isString(experienceId)) {

                    deferred.reject('Experience id (string) was expected');

                } else {

                    http.post('api/experience/delete', { experienceId: experienceId })
                        .done(function (response) {
                            if (!_.isObject(response)) {
                                deferred.reject('Response is not an object');
                                return;
                            }

                            if (!response.success) {
                                deferred.reject('Response is not successful');
                                return;
                            }

                            dataContext.experiences = _.reject(dataContext.experiences, function (experience) {
                                return experience.id == experienceId;
                            });

                            deferred.resolve();
                        })
                        .fail(function (reason) {
                            deferred.reject(reason);
                        });

                }

                return deferred.promise;
            },
            relateObjectives = function (experienceId, objectives) {
                var deferred = Q.defer();

                if (!_.isString(experienceId)) {
                    deferred.reject('Experience id is not valid');
                }

                if (!_.isArray(objectives)) {
                    deferred.reject('Objectives to relate are not array');
                }

                this.getById(experienceId)
                    .then(function (experince) {
                        _.each(objectives, function (objective) {
                            experince.objectives.push(objective);
                        });

                        experince.modifiedOn = new Date();
                        deferred.resolve(experince.modifiedOn);
                    })
                    .fail(function (reason) {
                        deferred.reject(reason);
                    });

                return deferred.promise;
            },
            unrelateObjectives = function (experienceId, objectives) {
                var deferred = Q.defer();

                if (!_.isString(experienceId)) {
                    deferred.reject('Experience id should be a string');
                }

                if (!_.isArray(objectives)) {
                    deferred.reject('objectives should be an array');
                }

                this.getById(experienceId)
                    .then(function (experience) {
                        experience.objectives = _.reject(experience.objectives, function (item) {
                            return _.contains(objectives, item.id);
                        });
                        experience.modifiedOn = new Date();
                        deferred.resolve(experience.modifiedOn);
                    })
                    .fail(function (reason) {
                        deferred.reject(reason);
                    });

                return deferred.promise;
            },
            updateExperienceTitle = function (experienceId, experienceTitle) {
                return Q.fcall(function () {
                    guard.throwIfNotString(experienceId, 'Experience id is not a string');
                    guard.throwIfNotString(experienceTitle, 'Experience title is not a string');

                    var requestArgs = {
                        experienceId: experienceId,
                        experienceTitle: experienceTitle
                    };

                    return httpWrapper.post('api/experience/updateTitle', requestArgs).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                        var experience = _.find(dataContext.experiences, function (item) {
                            return item.id === experienceId;
                        });

                        guard.throwIfNotAnObject(experience, 'Experience does not exist in dataContext');

                        experience.title = experienceTitle;
                        experience.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                        return experience.modifiedOn;
                    });

                });
            },
            updateExperienceTemplate = function (experienceId, templateId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(experienceId, 'Experience id is not a string');
                    guard.throwIfNotString(templateId, 'Template id is not a string');

                    var requestArgs = {
                        experienceId: experienceId,
                        templateId: templateId
                    };

                    return httpWrapper.post('api/experience/updateTemplate', requestArgs).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                        var experience = _.find(dataContext.experiences, function (item) {
                            return item.id === experienceId;
                        });

                        guard.throwIfNotAnObject(experience, 'Experience does not exist in dataContext');

                        var template = _.find(dataContext.templates, function (item) {
                            return item.id === templateId;
                        });

                        guard.throwIfNotAnObject(template, 'Template does not exist in dataContext');

                        experience.template = { id: template.id, name: template.name, image: template.image };
                        experience.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                        return experience.modifiedOn;
                    });

                });
            };

        return {
            getById: getById,
            getCollection: getCollection,

            addExperience: addExperience,
            updateExperienceTitle: updateExperienceTitle,
            updateExperienceTemplate: updateExperienceTemplate,

            removeExperience: removeExperience,
            relateObjectives: relateObjectives,
            unrelateObjectives: unrelateObjectives
        };
    }
);
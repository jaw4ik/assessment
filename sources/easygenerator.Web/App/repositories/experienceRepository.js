define(['dataContext', 'constants', 'plugins/http', 'models/experience', 'guard', 'httpWrapper'],
    function (dataContext, constants, http, experienceModel, guard, httpWrapper) {

        var
            getCollection = function () {
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

            addExperience = function (title, templateId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(title, 'Title is not a string');
                    guard.throwIfNotString(templateId, 'TemplateId is not a string');

                    var requestArgs = {
                        title: title,
                        templateId: templateId
                    };

                    return httpWrapper.post('api/experience/create', requestArgs)
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.Id, 'Response Id is not a string');
                            guard.throwIfNotString(response.CreatedOn, 'Response CreatedOn is not a string');

                            var template = _.find(dataContext.templates, function (item) {
                                return item.id === templateId;
                            });

                            guard.throwIfNotAnObject(template, 'Template does not exist in dataContext');

                            var experienceId = response.Id,
                                createdOn = new Date(parseInt(response.CreatedOn.substr(6), 10)),
                                createdExperience = new experienceModel({
                                    id: experienceId,
                                    title: title,
                                    template: {
                                        id: template.id,
                                        name: template.name,
                                        image: template.image
                                    },
                                    objectives: [],
                                    buildingStatus: constants.statuses.notStarted,
                                    publishingState: constants.statuses.notStarted,
                                    createdOn: createdOn,
                                    modifiedOn: createdOn
                                });

                            dataContext.experiences.push(createdExperience);

                            return {
                                id: createdExperience.id,
                                createdOn: createdExperience.createdOn
                            };
                        });
                });
            },

            removeExperience = function (experienceId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(experienceId, 'Experience id (string) was expected');

                    return httpWrapper.post('api/experience/delete', { experienceId: experienceId }).then(function () {
                        dataContext.experiences = _.reject(dataContext.experiences, function (experience) {
                            return experience.id === experienceId;
                        });
                    });
                });
            },

            relateObjectives = function (experienceId, objectives) {
                return Q.fcall(function () {
                    guard.throwIfNotString(experienceId, 'Experience id is not valid');
                    guard.throwIfNotArray(objectives, 'Objectives to relate are not array');

                    var requestArgs = {
                        experienceId: experienceId,
                        objectives: _.map(objectives, function (item) {
                            return item.id;
                        })
                    };

                    return httpWrapper.post('api/experience/relateObjectives', requestArgs).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                        var experience = _.find(dataContext.experiences, function (exp) {
                            return exp.id == experienceId;
                        });

                        guard.throwIfNotAnObject(experience, "Experience doesn`t exist");

                        _.each(objectives, function (objective) {
                            experience.objectives.push(objective);
                        });

                        experience.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));
                        return experience.modifiedOn;
                    });
                });
            },

            unrelateObjectives = function (experienceId, objectives) {
                return Q.fcall(function () {
                    guard.throwIfNotString(experienceId, 'Experience id is not valid');
                    guard.throwIfNotArray(objectives, 'Objectives to relate are not array');

                    var requestArgs = {
                        experienceId: experienceId,
                        objectives: _.map(objectives, function (item) {
                            return item.id;
                        })
                    };

                    return httpWrapper.post('api/experience/unrelateObjectives', requestArgs).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                        var experience = _.find(dataContext.experiences, function (exp) {
                            return exp.id == experienceId;
                        });
                        guard.throwIfNotAnObject(experience, "Experience doesn`t exist");

                        experience.objectives = _.reject(experience.objectives, function (objective) {
                            return _.find(objectives, function (item) {
                                return item.id == objective.id;
                            });
                        });

                        experience.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));
                        return experience.modifiedOn;
                    });
                });
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

                        return {
                            modifiedOn: experience.modifiedOn
                        };
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
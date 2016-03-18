define(['dataContext', 'constants', 'http/apiHttpWrapper', 'guard', 'models/section', 'durandal/app'],
    function (dataContext, constants, apiHttpWrapper, guard, sectionModel, app) {
        "use strict";

        var repository = {
            getById: getById,
            getCollection: getCollection,
            addSection: addSection,
            removeSection: removeSection,
            permanentlyDelete: permanentlyDelete,
            updateTitle: updateTitle,
            updateLearningObjective: updateLearningObjective,
            updateImage: updateImage,
            updateQuestionsOrder: updateQuestionsOrder
        };

        return repository;

        function getCollection() {

            return Q.fcall(function () {
                return dataContext.sections;
            });
        }

        function getById(id) {
            return Q.fcall(function () {
                guard.throwIfNotString(id, 'Section id (string) was expected');

                var result = _.find(dataContext.sections, function (item) {
                    return item.id === id;
                });

                guard.throwIfNotAnObject(result, 'Section with this id is not found');

                return result;
            });
        }

        function addSection(section) {
            return Q.fcall(function () {
                guard.throwIfNotAnObject(section, 'Section data is not an object');

                return apiHttpWrapper.post('api/section/create', section).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.Id, 'Section Id is not a string');
                    guard.throwIfNotString(response.ImageUrl, 'Section ImageUrl is not a string');
                    guard.throwIfNotString(response.CreatedOn, 'Section creation date is not a string');
                    guard.throwIfNotString(response.CreatedBy, 'Section createdBy is not a string');
                    
                    var
                        createdSection = new sectionModel({
                            id: response.Id,
                            title: section.title,
                            image: response.ImageUrl,
                            questions: [],
                            createdOn: new Date(response.CreatedOn),
                            createdBy: response.CreatedBy,
                            modifiedOn: new Date(response.CreatedOn)
                        });

                    dataContext.sections.push(createdSection);

                    return createdSection;
                });
            });
        }

        function updateTitle(sectionId, title) {
            return Q.fcall(function () {
                guard.throwIfNotString(sectionId, 'Section data has invalid format');
                guard.throwIfNotString(title, 'Section data has invalid format');

                return apiHttpWrapper.post('api/section/updatetitle', { sectionId: sectionId, title: title }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var section = _.find(dataContext.sections, function (item) {
                        return item.id === sectionId;
                    });

                    guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

                    section.title = title;
                    section.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.section.titleUpdated, section);

                    return section.modifiedOn;
                });
            });
        }

        function updateLearningObjective(sectionId, learningObjective) {
            return Q.fcall(function () {
                guard.throwIfNotString(sectionId, 'Section data has invalid format');
                guard.throwIfNotString(learningObjective, 'Section data has invalid format');

                return apiHttpWrapper.post('api/section/updatelearningobjective', { sectionId: sectionId, learningObjective: learningObjective }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var section = _.find(dataContext.sections, function (item) {
                        return item.id === sectionId;
                    });

                    guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

                    section.learningObjective = learningObjective;
                    section.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.section.learningObjectiveUpdated, section);

                    return section.modifiedOn;
                });
            });
        }

        function updateImage(sectionId, imageUrl) {
            return Q.fcall(function () {
                guard.throwIfNotString(sectionId, 'Section data has invalid format');
                guard.throwIfNotString(imageUrl, 'Section data has invalid format');

                imageUrl += '?width=120&height=120&scaleBySmallerSide=true';

                return apiHttpWrapper.post('api/section/updateimage', { sectionId: sectionId, imageUrl: imageUrl }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var section = _.find(dataContext.sections, function (item) {
                        return item.id === sectionId;
                    });

                    guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

                    section.image = imageUrl;
                    section.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.section.imageUrlUpdated, section);

                    return {
                        modifiedOn: section.modifiedOn,
                        imageUrl: imageUrl
                    };
                });
            });
        }

        function removeSection(sectionId) {
            return Q.fcall(function () {
                guard.throwIfNotString(sectionId, 'Section id was expected');

                return apiHttpWrapper.post('api/section/delete', { sectionId: sectionId }).then(function () {
                    dataContext.sections = _.reject(dataContext.sections, function (section) {
                        return section.id == sectionId;
                    });
                });
            });
        }

        function permanentlyDelete(sectionId) {
            return Q.fcall(function () {
                guard.throwIfNotString(sectionId, 'Section id was expected');

                return apiHttpWrapper.post('api/section/permanentlydelete', { sectionId: sectionId }).then(function () {

                    _.each(dataContext.courses, function(course) {
                        course.sections = _.reject(course.sections, function(section) {
                            return section.id === sectionId;
                        });
                    });


                    dataContext.sections = _.reject(dataContext.sections, function (section) {
                        return section.id === sectionId;
                    });

                    app.trigger(constants.messages.section.deleted, sectionId);
                });
            });
        }

        function updateQuestionsOrder(sectionId, questions) {
            return Q.fcall(function () {
                guard.throwIfNotString(sectionId, 'Section id (string) was expected');
                guard.throwIfNotArray(questions, 'Questions is not array');

                var requestArgs = {
                    sectionId: sectionId,
                    questions: _.map(questions, function (item) {
                        return item.id;
                    })
                };

                return apiHttpWrapper.post('api/section/updatequestionsorder', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var section = _.find(dataContext.sections, function (item) {
                        return item.id === sectionId;
                    });

                    guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

                    section.questions = _.map(questions, function (question) {
                        return _.find(section.questions, function (item) {
                            return item.id == question.id;
                        });
                    });

                    section.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.section.questionsReordered, section);

                    return {
                        modifiedOn: section.modifiedOn
                    };
                });
            });
        }

    }
);
define(['models/entity', 'services/publishService', 'durandal/app', 'constants'],
    function (EntityModel, publishService, app, constants) {
        "use strict";

        var LearningPath = function(spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.publicationUrl = spec.publicationUrl;
            obj.courses = spec.courses;

            obj.isBuilding = false;
            obj.isPublishing = false;
            obj.isDelivering = isDelivering;
            obj.build = build;
            obj.publish = publish;

            return obj;

            function isDelivering() {
                return obj.isBuilding || obj.isPublishing;
            }

            function build() {
                return Q.fcall(function() {
                    if (obj.isDelivering()) {
                        return;
                    }

                    obj.isBuilding = true;
                    app.trigger(constants.messages.learningPath.delivering.started, obj);

                    return publishService.buildLearningPath(obj.id)
                        .then(function(buildInfo) {
                            return buildInfo.packageUrl;
                        })
                        .fail(function(message) {
                            throw message;
                        })
                        .fin(function() {
                                obj.isBuilding = false;
                                app.trigger(constants.messages.learningPath.delivering.finished, obj);
                            }
                        );
                });
            }

            function publish() {
                return Q.fcall(function() {
                    if (obj.isDelivering()) {
                        return;
                    }

                    obj.isPublishing = true;
                    app.trigger(constants.messages.learningPath.delivering.started, obj);

                    return publishService.buildLearningPath(obj.id)
                        .then(function () {
                            return publishService.publishLearningPath(obj.id)
                                .then(function (buildInfo) {
                                    obj.publicationUrl = buildInfo.publicationUrl;
                                    return buildInfo.publicationUrl;
                                })
                                .fail(function (message) {
                                    obj.publicationUrl = null;
                                    throw message;
                                });
                        })
                        .fail(function (message) {
                            throw message;
                        })
                        .fin(function () {
                            obj.isPublishing = false;
                            app.trigger(constants.messages.learningPath.delivering.finished, obj);
                        });
                });
            }
        }

        return LearningPath;
    }
);
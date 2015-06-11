define(['models/entity', 'services/publishService'],
    function (EntityModel, publishService) {
        "use strict";

        var LearningPath = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.courses = spec.courses;

            obj.isDelivering = false;
            obj.build = build;

            return obj;

            function build() {
                return Q.fcall(function() {
                    if (obj.isDelivering) {
                        return;
                    }

                    obj.isDelivering = true;

                    return publishService.buildLearningPath(obj.id)
                        .then(function (buildInfo) {
                            return buildInfo.packageUrl;
                        })
                        .fail(function (message) {
                            throw message;
                        })
                        .fin(function () {
                            obj.isDelivering = false;
                        }
                    );

                });
            }
        };

        return LearningPath;
    }
);
define(['models/entity'],
    function (entityModel) {
        "use strict";

        var template = function (spec) {

            var obj = new entityModel(spec);

            obj.name = spec.name;
            obj.image = spec.image;
            obj.description = spec.description;
            obj.settingsUrl = spec.settingsUrl;
            obj.previewDemoUrl = spec.previewDemoUrl;

            return obj;
        };

        return template;
    }
);
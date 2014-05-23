define(['models/entity'],
    function (Entity) {
        "use strict";

        var template = function (spec) {

            var obj = new Entity(spec);

            obj.name = spec.name;
            obj.image = spec.image;
            obj.description = spec.description;
            obj.settingsUrl = spec.settingsUrl;
            obj.previewDemoUrl = spec.previewDemoUrl;
            obj.order = spec.order;

            return obj;
        };

        return template;
    }
);
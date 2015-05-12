define(['models/entity'],
    function (Entity) {
        "use strict";

        var template = function (spec) {
            var obj = new Entity(spec);

            obj.name = spec.name;
            obj.thumbnail = spec.thumbnail;
            obj.previewImages = spec.previewImages;
            obj.shortDescription = spec.shortDescription;
            obj.settingsUrls = spec.settingsUrls;
            obj.previewDemoUrl = spec.previewDemoUrl;
            obj.order = spec.order;
            obj.isCustom = spec.isCustom;
            obj.isNew = spec.isNew;

            return obj;
        };

        return template;
    }
);
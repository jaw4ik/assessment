﻿define(['models/entity'],
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
            obj.isDeprecated = spec.isDeprecated;
            obj.goal = spec.goal;

            obj.supports = spec.supports;
            obj.presets = spec.presets;

            return obj;
        };

        return template;
    }
);
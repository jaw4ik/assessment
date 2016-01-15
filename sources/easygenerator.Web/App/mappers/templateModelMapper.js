define(['models/template', 'underscore'], function (TemplateModel, _) {
    "use strict";

    var
        map = function (item) {
            var templateData = {
                id: item.Id,
                previewDemoUrl: item.PreviewDemoUrl,
                order: item.Order,
                isNew: item.IsNew,
                isDeprecated: item.IsDeprecated,
                isCustom: item.IsCustom
            };
            var manifestData = getManifestData(JSON.parse(item.Manifest), item.TemplateUrl);
            return new TemplateModel(_.extend(templateData, manifestData));
        };

    return {
        map: map
    };

    function getManifestData(manifest, templateUrl) {
        //TODO: Should be deleted when all templates will be reworked to new settings scheme
        //End TODO

        return {
            name: manifest.name,
            thumbnail: templateUrl + manifest.thumbnail + '?v=' + window.appVersion,
            previewImages: _.map(manifest.previewImages, function(img) {
                return templateUrl + img + '?v=' + window.appVersion;
            }),
            supports: manifest.supports,
            presets: manifest.presets,
            settingsUrls: {
                design: _.mapObject(manifest.settingsUrls && manifest.settingsUrls.design, function(value, key) {
                    return {
                        name: key,
                        url: templateUrl + value
                    }
                }),
                configure: (manifest.settingsUrls && manifest.settingsUrls.configure) ? templateUrl + manifest.settingsUrls.configure : null
            },
            shortDescription: manifest.shortDescription,
            goal: manifest.goal
        };
    }
});
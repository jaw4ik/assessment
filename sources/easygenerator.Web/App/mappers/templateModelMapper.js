define(['models/template'],
    function (TemplateModel) {
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
            if (_.isNullOrUndefined(manifest.settingsUrls)) {
                manifest.settingsUrls = {
                    design: manifest.settingsUrl
                };
            }
            //End TODO

            return {
                name: manifest.name,
                thumbnail: templateUrl + manifest.thumbnail,
                previewImages: _.map(manifest.previewImages, function (img) {
                    return templateUrl + img;
                }),
                settingsUrls: {
                    design: (manifest.settingsUrls && manifest.settingsUrls.design) ? templateUrl + manifest.settingsUrls.design : null,
                    configure: (manifest.settingsUrls && manifest.settingsUrls.configure) ? templateUrl + manifest.settingsUrls.configure : null
                },
                shortDescription: manifest.shortDescription
            };
        }
    });
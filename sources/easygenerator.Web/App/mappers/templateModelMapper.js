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
                    isCustom: item.IsCustom
                };
                var manifestData = getManifestData(JSON.parse(item.Manifest), item.TemplateUrl);
                return new TemplateModel(_.extend(templateData, manifestData));
            };

        return {
            map: map
        };

        function getManifestData(manifest, templateUrl) {
            return {
                name: manifest.name,
                thumbnail: templateUrl + manifest.thumbnail,
                previewImages: _.map(manifest.previewImages, function (img) {
                    return templateUrl + img;
                }),
                settingsUrl: templateUrl + manifest.settingsUrl,
                shortDescription: manifest.shortDescription
            };
        }
    });
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
                var manifestData = getManifestData(JSON.parse(item.Manifest), item.PreviewDemoUrl);
                return new TemplateModel(_.extend(templateData, manifestData));
            };

        return {
            map: map
        };

        function getManifestData(manifest, previewDemoUrl) {
            return {
                name: manifest.name,
                thumbnail: previewDemoUrl + manifest.thumbnail,
                previewImages: _.map(manifest.previewImages, function (img) {
                    return previewDemoUrl + img;
                }),
                settingsUrl: previewDemoUrl + manifest.settingsUrl,
                shortDescription: manifest.shortDescription
            };
        }
    });
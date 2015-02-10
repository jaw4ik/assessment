define(['models/template'],
    function (TemplateModel) {
        "use strict";

        var
            map = function (item) {
                parseManifest(item);
                return new TemplateModel(
                 {
                     id: item.Id,
                     name: item.name,
                     thumbnail: item.thumbnail,
                     previewImages: item.previewImages,
                     settingsUrl: item.settingsUrl,
                     shortDescription: item.shortDescription,
                     previewDemoUrl: item.PreviewDemoUrl,
                     order: item.Order
                 });
            };

        return {
            map: map
        };

        function parseManifest(item) {
            item.Manifest = JSON.parse(item.Manifest);

            item.name = item.Manifest.name;
            item.thumbnail = item.PreviewDemoUrl + item.Manifest.thumbnail;
            item.previewImages = [];
            _.each(item.Manifest.previewImages, function (img) {
                item.previewImages.push(item.PreviewDemoUrl + img);
            });
            item.settingsUrl = item.PreviewDemoUrl + item.Manifest.settingsUrl;
            item.shortDescription = item.Manifest.shortDescription;
        }
    });
define(['models/template'],
    function (TemplateModel) {
        "use strict";

        var
            map = function (item) {
                return new TemplateModel(
                 {
                     id: item.Id,
                     name: item.Name,
                     image: item.Image,
                     settingsUrl: item.SettingsUrl,
                     description: item.Description,
                     previewDemoUrl: item.PreviewDemoUrl,
                     order: item.Order
                 });
            };

        return {
            map: map
        };
    });
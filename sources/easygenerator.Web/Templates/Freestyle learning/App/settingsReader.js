﻿define(function () {
    
    function readTemplateSettings() {
        return read('settings.js');
    }

    function readPublishSettings() {
        return read('publishSettings.js');
    }

    function read(filename) {
        var defer = Q.defer();
        $.getJSON(filename).then(function (json) {
            defer.resolve(json);
        }).fail(function() {
            defer.resolve({});
        });

        return defer.promise;
    }
    
    return {
        readTemplateSettings: readTemplateSettings,
        readPublishSettings: readPublishSettings
    };
    
});
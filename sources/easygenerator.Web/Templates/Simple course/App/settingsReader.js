define(function () {

    var ticks = new Date().getTime();

    function readTemplateSettings() {
        return read('settings.js?v=' + ticks);
    }

    function readPublishSettings() {
        return read('publishSettings.js?v=' + ticks);
    }

    function read(filename) {
        var defer = Q.defer();
        $.getJSON(filename).then(function (json) {
            defer.resolve(json);
        }).fail(function () {
            defer.resolve({});
        });

        return defer.promise;
    }

    return {
        readTemplateSettings: readTemplateSettings,
        readPublishSettings: readPublishSettings
    };

});
define(['modules/templateSettings'], function (templateSettings) {
    "use strict";

    var themesInjector = {
        themesPath: 'css/themes',
        defaultThemeKey: 'default',

        init: init
    };

    return themesInjector;

    function init() {
        return Q.fcall(function () {
            var
                selectedThemeKey = getSelectedThemeKey(),
                themePath = themesInjector.themesPath + '/' + selectedThemeKey + '.css';

            injectStylesheetToDocument(themePath);
        });
    }

    function getSelectedThemeKey() {
        var selectedThemeKey = getQueryStringParameterByName('theme');
        if (_.isEmptyOrWhitespace(selectedThemeKey)) {
            selectedThemeKey = templateSettings.theme ? templateSettings.theme.key : themesInjector.defaultThemeKey;
        }

        return selectedThemeKey;
    }

    function injectStylesheetToDocument(url) {
        if (_.isNullOrUndefined(url)) {
            return;
        }

        var link = document.createElement("link");

        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;

        document.head.appendChild(link);
    }

    function getQueryStringParameterByName(name) {
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

});
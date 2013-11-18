﻿define(['localization/resources'],
    function (resources) {
        "use strict";

        var
            defaultCulture = "en",
            supportedCultures = [
                "en", "en-US",
                "nl", "nl-NL",
                "de", "de-DE"
            ],
            currentCulture = defaultCulture,
            currentLanguage = '',

            localize = function (key, culture) {
                var item = resources[key];
                if (_.isEmpty(item)) {
                    throw 'A resource with key ' + key + ' was not found';
                }
                var cultureInfo = _.contains(supportedCultures, culture) ? culture : this.currentLanguage || defaultCulture;
                return item[cultureInfo] || item[defaultCulture];
            },

            initialize = function (userCultures) {

                userCultures = userCultures || [];

                var
                    match = null,
                    i = 0, j = 0,
                    uclength = userCultures.length,
                    sclength = supportedCultures.length;

                for (i = 0; i < uclength; i++) {
                    if (_.isString(match)) {
                        break;
                    }
                    for (j = 0; j < sclength; j++) {
                        if (userCultures[i].toLowerCase() == supportedCultures[j].toLowerCase()) {
                            match = supportedCultures[j];
                            break;
                        }
                    }
                }

                this.currentCulture = _.isString(match) ? match : defaultCulture;
                this.currentLanguage = this.currentCulture.substring(0, 2);
            };


        (function () {
            ko.bindingHandlers.localize = {
                init: function (element, valueAccessor) {
                    var value = valueAccessor();

                    if (_.isEmpty(value)) {
                        return;
                    }

                    var localizationManager = require("localization/localizationManager");

                    if (_.isString(value['text'])) {
                        $(element).text(localizationManager.localize(value['text']));
                    }
                    if (_.isString(value['placeholder'])) {
                        $(element).prop('placeholder', localizationManager.localize(value['placeholder']));
                    }
                    if (_.isString(value['value'])) {
                        $(element).prop('value', localizationManager.localize(value['value']));
                    }
                    if (_.isString(value['title'])) {
                        $(element).prop('title', localizationManager.localize(value['title']));
                    }
                }
            };
        })();

        return {
            initialize: initialize,
            currentCulture: currentCulture,
            currentLanguage: currentLanguage,
            localize: localize,
            defaultCulture: defaultCulture,
            supportedCultures: supportedCultures
        };
    });
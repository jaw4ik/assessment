define(['localization/resources'],
    function (resources) {
        "use strict";

        var
            defaultCulture = "en",
            supportedCultures = [
                "en", "en-us", "en-US",
                "nl", "nl-nl", "nl-NL",
                "de", "de-de", "de-DE"
            ],
            currentLanguage = '',
            currentCulture = '',

            localize = function (key) {
                var item = resources[key];
                if (_.isEmpty(item)) {
                    throw 'A resource with key ' + key + ' was not found';
                }

                return item[this.currentLanguage] || item[defaultCulture];
            },

            initialize = function (userCultures) {                
                var matches = _.intersection(userCultures, supportedCultures);
                if (matches.length > 0) {
                    this.currentCulture = matches[0];
                } else {
                    this.currentCulture = defaultCulture;
                }
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
            localize: localize
        };
    });
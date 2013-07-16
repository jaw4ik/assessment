define(['localization/resources'],
    function (resources) {
        "use strict";

        var
            defaultCulture = window.top.egLanguage || window.navigator.userLanguage || window.navigator.language,

            currentLanguage = ko.observable(defaultCulture),

            localize = function (key) {

                if (_.isEmpty(resources)) {
                    throw 'Resource collection was not loaded properly';
                }

                var item = resources[key];
                if (_.isEmpty(item)) {
                    throw 'A resource with key ' + key + ' was not found';
                }

                return item[currentLanguage()] || item[defaultCulture] || item['en'];
            };




        ko.bindingHandlers.localize = {
            init: function (element, valueAccessor) {
                var value = valueAccessor();

                if (_.isEmpty(value)) {
                    return;
                }
                if (_.isString(value['text'])) {
                    $(element).text(localize(value['text']));
                }
                if (_.isString(value['placeholder'])) {
                    $(element).prop('placeholder', localize(value['placeholder']));
                }
                if (_.isString(value['value'])) {
                    $(element).prop('value', localize(value['value']));
                }
                if (_.isString(value['title'])) {
                    $(element).prop('title', localize(value['title']));
                }
            }
        };

        return {
            currentLanguage: currentLanguage,
            localize: localize
        };
    });
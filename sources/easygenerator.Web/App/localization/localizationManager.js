define(['localization/resources'],
    function (resources) {
        "use strict";

        var
            defaultCulture = 'en',

            currentLanguage = ko.observable(defaultCulture),

            localize = function (key) {

                if (_.isEmpty(resources)) {
                    throw 'Resource collection was not loaded properly';
                }

                var item = resources[key];
                if (_.isEmpty(item)) {
                    throw 'A resource with key ' + key + ' was not found';
                }

                return item[currentLanguage()] || item[defaultCulture];
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
            }
        };

        return {
            currentLanguage: currentLanguage,
            localize: localize
        };
    });
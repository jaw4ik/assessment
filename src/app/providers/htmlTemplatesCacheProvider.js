(function () {
    'use strict';

    angular.module('quiz')
           .provider('htmlTemplatesCache', htmlTemplatesCache);

    function htmlTemplatesCache() {
        var templates = [];
        return {
            set: function (value) {
                if (!_.isArray(value) || value.length === 0) {
                    return;
                }

                templates = value;
            },
            $get: function () {
                return templates;
            }
        };
    }
}());
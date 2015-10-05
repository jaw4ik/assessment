define(['jquery'], function ($) {
    'use strict';

    function read(filename) {
        var defer = Q.defer();
        $.getJSON(filename + '?_=' + window.appVersion).then(function (json) {
            defer.resolve(json);
        }).fail(function () {
            defer.resolve({});
        });

        return defer.promise;
    }

    return {
        read: read
    };

});
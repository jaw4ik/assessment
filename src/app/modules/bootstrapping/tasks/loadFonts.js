(function () {
    'use strict';

    angular.module('bootstrapping').factory('loadFontsTask', loadFontsTask);

    loadFontsTask.$inject = ['webFontLoaderService'];

    function loadFontsTask(webFontLoaderService) {
        return webFontLoaderService.load();
    }

}());
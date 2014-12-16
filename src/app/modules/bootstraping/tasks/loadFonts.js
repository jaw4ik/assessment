(function () {
    'use strict';

    angular.module('bootstraping').factory('loadFontsTask', loadFontsTask);

    loadFontsTask.$inject = ['webFontLoaderService'];

    function loadFontsTask(webFontLoaderService) {
        return webFontLoaderService.load();
    }

}());
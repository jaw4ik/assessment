(function () {
    'use strict';

    angular.module('bootstrapping').factory('preloadHtmlTask', preloadHtmlTask);

    preloadHtmlTask.$inject = ['$q', 'fileReadingService'];

    function preloadHtmlTask($q, fileReadingService) {
        var dfr = $q.defer(),
            promises = [],
            templates = [];
        
        promises.push(fileReadingService.readHtml('app/views/hint.html').then(function(response) {
            setTemplate('app/views/hint.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/dragAndDropText.html').then(function (response) {
            setTemplate('app/views/dragAndDropText.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/fillInTheBlanks.html').then(function (response) {
            setTemplate('app/views/fillInTheBlanks.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/hotspot.html').then(function (response) {
            setTemplate('app/views/hotspot.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/multipleSelectText.html').then(function (response) {
            setTemplate('app/views/multipleSelectText.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/singleSelectImage.html').then(function (response) {
            setTemplate('app/views/singleSelectImage.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/singleSelectText.html').then(function (response) {
            setTemplate('app/views/singleSelectText.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/statement.html').then(function (response) {
            setTemplate('app/views/statement.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/textMatching.html').then(function (response) {
            setTemplate('app/views/textMatching.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/statementItem.html').then(function (response) {
            setTemplate('app/views/statementItem.html', response);
        }));
        promises.push(fileReadingService.readHtml('app/views/hint.html').then(function (response) {
            setTemplate('app/views/hint.html', response);
        }));

        $q.all(promises).then(function() {
            dfr.resolve(templates);
        });

        return dfr.promise;

        function setTemplate(url, html) {
            templates.push({
                key: url,
                value: html
            });
        }
    }
}());

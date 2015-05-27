(function () {
    'use strict';

    angular.module('bootstrapping').factory('preloadHtmlTask', preloadHtmlTask);

    preloadHtmlTask.$inject = ['$q', 'fileReadingService'];

    var htmlStack = [
        'app/views/widgets/tooltip.html',
        'app/views/main.html',
        'app/views/hint.html',
        'app/views/dragAndDropText.html',
        'app/views/fillInTheBlanks.html',
        'app/views/hotspot.html',
        'app/views/multipleSelectText.html',
        'app/views/singleSelectImage.html',
        'app/views/singleSelectText.html',
        'app/views/statement.html',
        'app/views/textMatching.html',
        'app/views/statementItem.html',
        'app/views/openQuestion.html'
    ];

    function preloadHtmlTask($q, fileReadingService) {
        var dfr = $q.defer(),
            promises = [],
            templates = [];

        htmlStack.forEach(function(url) {
            promises.push(fileReadingService.readHtml(url).then(function (response) {
                templates.push({
                    key: url,
                    value: response
                });
            }));
        });

        $q.all(promises).then(function() {
            dfr.resolve(templates);
        });

        return dfr.promise;
    }
}());

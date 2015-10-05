define(['jquery', 'cultureInfo'], function ($, cultureInfo) {
    var task = {
        execute: execute
    };

    return task;

    function execute() {
        cultureInfo.initialize(window.userCultures);
        $('html').attr('lang', cultureInfo.language);
    }
});
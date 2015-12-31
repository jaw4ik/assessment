define(['jquery'], function ($) {
    
    var task = {
        execute: execute
    };

    return task;

    function execute() {
        $(window).on("hashchange", function() {
            var $activeElement = $(':focus');

            if ($activeElement.length) {
                $activeElement.blur();
            }
        });
    }
});
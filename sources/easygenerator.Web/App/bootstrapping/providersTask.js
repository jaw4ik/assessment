define(['analytics/providers'], function (providers) {

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        providers.initialize();
    }
});
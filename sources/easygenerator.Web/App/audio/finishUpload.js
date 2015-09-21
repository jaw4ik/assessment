define(['constants', 'audio/commands/markAvailable', 'audio/convertion/commands/finalize'], function (constants, markAvailable, finalize) {
    return {
        execute: execute
    }

    function execute(model) {
        return finalize.execute(model).then(function () {
            return markAvailable.execute(model);
        });
    }
});
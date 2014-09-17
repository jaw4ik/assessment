define(['onboarding/inititalization'],
    function (inititalization) {
        "use strict";

        var task = {
            execute: execute
        };

        return task;

        function execute() {
            inititalization.initialize();
        }
    }
);
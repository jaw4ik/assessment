define(['plugins/router', 'eventManager', 'context', 'xApi/xApiInitializer' ],
    function (router, eventManager, context, xApiInitializer) {

        "use strict";

        var viewModel = {
            activate: activate,
            courseTitle: "\"" + context.course.title + "\"",

            skip: skip
        };

        return viewModel;

        function skip() {
            xApiInitializer.turnOff();
            startCourse();
        };
     
        function startCourse () {
            eventManager.courseStarted();
            router.navigate('');
        };

        function activate() {};
    });
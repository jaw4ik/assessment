define(['plugins/router', 'eventManager', 'context'],
    function(router, eventManager, context) {

        "use strict";

        var viewModel = {
            activate: activate,
            courseTitle: "\"" + context.course.title + "\"",

            skip: skip
        };

        return viewModel;

        function skip () {
            startCourse();
        };
     
        function startCourse () {
            eventManager.courseStarted();
            router.navigate('');
        };

        function activate() {};
    });
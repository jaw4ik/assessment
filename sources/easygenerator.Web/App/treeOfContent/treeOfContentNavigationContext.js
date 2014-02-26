define(['plugins/router'], function (router) {

    return ko.computed(function () {
        var activeInstruction = router.activeInstruction();

        var context = [];

        if (activeInstruction.queryParams && activeInstruction.queryParams.courseId) {
            context.push(activeInstruction.queryParams.courseId);
        }

        _.each(activeInstruction.params, function (param) {
            if (_.isString(param)) {
                context.push(param);
            } 
        });

        return context;
    });

})  
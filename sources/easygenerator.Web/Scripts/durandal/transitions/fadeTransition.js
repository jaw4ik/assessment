define(['durandal/system', 'durandal/composition', 'jquery'], function (system, composition, $) {
    var fadeTransition = function (context) {
        return system.defer(function (dfd) {
            context.triggerAttach();

            if (context.activeView) {
                $(context.activeView).fadeOut(200, function () {
                    $(context.child).fadeIn(200, function () {
                        dfd.resolve();
                    });
                });
            } else {
                dfd.resolve();
            }

        }).promise();

    };

    return fadeTransition;
});

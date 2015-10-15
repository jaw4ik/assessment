define(['durandal/system', 'durandal/composition', 'jquery'], function (system, composition, $) {
    var defaultRouterTransition = function (context) {
        return system.defer(function (dfd) {
            if (context.bindingContext.$data && context.bindingContext.$data.isViewReady && ko.isObservable(context.bindingContext.$data.isViewReady)) {
                composition.current.complete(function() {
                    context.bindingContext.$data.isViewReady(true);
                });
            }

            if (!context.keepScrollPosition) {
                $("#view_content").scrollTop(0);
            }

            context.triggerAttach();

            $(context.child).show();

            dfd.resolve();
        }).promise();

    };

    return defaultRouterTransition;
});

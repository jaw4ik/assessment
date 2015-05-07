define(['durandal/system', 'durandal/composition', 'jquery'], function (system, composition, $) {
    var notificationTransition = function (context) {
        return system.defer(function (dfd) {
            context.triggerAttach();

            if (context.activeView) {
                var isMovingForward = context.bindingContext.$data.isMovingForward,
                    $currentView = $(context.activeView),
                    $targetView = $(context.child),
                    $container = $currentView.parent(),
                    containerReversedClassName = 'reversed',
                    speed = 300;

                if (isMovingForward) {
                    $container.addClass(containerReversedClassName);
                } else {
                    $container.removeClass(containerReversedClassName);
                }

                $targetView.show();
                $currentView.animate(isMovingForward ? { marginLeft: '-100%' } : { marginRight: '-100%' }, speed, function () {
                    dfd.resolve();
                });

            } else {
                dfd.resolve();
            }

        }).promise();

    };

    return notificationTransition;
});

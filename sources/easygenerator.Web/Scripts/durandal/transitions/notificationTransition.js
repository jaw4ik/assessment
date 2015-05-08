define(['durandal/system', 'durandal/composition', 'jquery'], function (system, composition, $) {
    var notificationTransition = function (context) {
        return system.defer(function (dfd) {
            context.triggerAttach();

            if (context.activeView) {
                var isMovingForward = context.bindingContext.$data.moveDirection === 'next',
                    $currentView = $(context.activeView),
                    $targetView = $(context.child),
                    $container = $currentView.parent(),
                    animationSettings,
                    speed = 300;

                if (!context.bindingContext.$data.moveDirection) {
                    $currentView.hide();
                    $targetView.show();
                } else {
                    $container.width($currentView.width() * 2);

                    if (isMovingForward) {
                        $currentView.css('float', 'left');
                        $targetView.css('float', 'right').show();

                        $currentView.animate({ marginLeft: '-50%' }, speed);
                        animationSettings = { marginRight: '50%' };
                    } else {
                        $targetView.css('float', 'left')
                            .css('margin-left', '-' + $currentView.width() + 'px')
                            .show();
                        animationSettings = { marginLeft: '0px' };
                    }

                    $targetView.animate(animationSettings, speed, function () {
                        $currentView.hide();
                        $targetView.css('float', 'none')
                            .css('marginRight', '0')
                            .css('marginLeft', '0');
                        $container.width('100%');
                        dfd.resolve();
                    });
                }

            } else {
                dfd.resolve();
            }

        }).promise();

    };

    return notificationTransition;
});

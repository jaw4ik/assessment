define(['durandal/system', 'durandal/composition', 'jquery'], function (system, composition, $) {
    var notificationTransition = function (context) {
        return system.defer(function (dfd) {
            context.triggerAttach();

            if (context.activeView) {
                var isMovingForward = context.bindingContext.$data.isMovingForward,
                    $currentView = $(context.activeView),
                    $targetView = $(context.child),
                    $container = $currentView.parent(),
                    animationSettings,
                    css = {
                        pullRight: 'pull-right',
                        pullLeft: 'pull-left'
                    },
                    speed = 300;

                $container.width($currentView.width() * 2);

                if (isMovingForward) {
                    $currentView.addClass(css.pullLeft);
                    $targetView.addClass(css.pullRight).show();

                    $currentView.animate({ marginLeft: '-50%' }, speed);
                    animationSettings = { marginRight: '50%' };
                } else {
                    $targetView.addClass(css.pullLeft).css('margin-left', '-' + $currentView.width() + 'px').show();
                    animationSettings = { marginLeft: '0px' };
                }

                $targetView.animate(animationSettings, speed, function () {
                    $currentView.hide();
                    $targetView.removeClass(css.pullLeft).removeClass(css.pullRight).css('marginRight', '0').css('marginLeft', '0');
                    $container.width('100%');
                    dfd.resolve();
                });


            } else {
                dfd.resolve();
            }

        }).promise();

    };

    return notificationTransition;
});

define(['durandal/system', 'durandal/composition', 'jquery'], function (system, composition, $) {
    var dialogStepTransition = function (context) {
        return system.defer(function (dfd) {
            context.triggerAttach();
            if (context.activeView) {
                var $currentView = $(context.activeView),
                    $targetView = $(context.child),
                    speed = 300;
                
                $targetView.show();

                var targetHeight = $targetView.outerHeight();
                var currentHeight = $currentView.outerHeight();
                $targetView.height(currentHeight);

                $currentView.hide();

                $targetView.animate({ height: targetHeight }, speed);
                dfd.resolve();

            } else {
                dfd.resolve();
            }

        }).promise();

    };

    return dialogStepTransition;
});

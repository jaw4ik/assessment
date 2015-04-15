define([], function () {

    return {
        assign: assign
    }

    function assign(router, permanent) {

        router.isViewReady = ko.observable();
        router.on('router:navigation:processing').then(function (instruction, router) {
            if (instruction.config.moduleId !== router.isViewReady() || permanent) {
                router.isViewReady(false);
            }
        });
        router.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
            if (instance) {
                setTimeout(function () {
                    router.isViewReady(permanent || instance.__moduleId__);
                }, 250);
            }
        });

    }

})
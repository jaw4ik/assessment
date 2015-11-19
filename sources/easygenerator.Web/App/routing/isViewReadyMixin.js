function assign(router, permanent) {

    var moduleId;

    router.isViewReady = ko.observable();
    router.on('router:navigation:processing').then(function (instruction, router) {
        moduleId = instruction.config.moduleId;
        if (instruction.config.moduleId !== router.isViewReady() || permanent) {
            router.isViewReady(false);
        }
    });
    router.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
        if (_.isNullOrUndefined(instance) || instance.__moduleId__ !== moduleId) {
            return;
        }
        setTimeout(function () {
            router.isViewReady(permanent || moduleId);
        }, 250);
    });

}

export default { assign };
export var __useDefault = true;
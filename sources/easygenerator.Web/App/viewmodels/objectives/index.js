define(['viewmodels/shell'], function (shell) {

    var childRouter = shell.router.createChildRouter()
       .makeRelative({
           fromParent: true
       }).map([
           { route: '', moduleId: 'viewmodels/objectives/objectives', title: 'Objectives', settings: { localizationKey: 'learningObjectives' } },
           { route: ':objectiveId', moduleId: 'viewmodels/objectives/objective', title: 'Learning Objective', settings: { localizationKey: 'objectiveProperties' } },
           { route: ':objectiveId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: 'Question', settings: { localizationKey: 'questionProperties' } }
       ]).buildNavigationModel();

    childRouter.isViewReady = ko.observable();
    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        if (instruction.config.moduleId !== router.isViewReady()) {
            router.isViewReady(false);
        }
    });
    childRouter.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
        if (instance) {
            setTimeout(function () {
                router.isViewReady(instance.__moduleId__);
            }, 250);
        }
    });

    return {
        router: childRouter
    };

})
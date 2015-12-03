define(['plugins/router'], function (router) {
    'use strict';

    var barsConfigurations = [
        {
            viewToCompose: 'navigationBar/navigationBar',
            subscribedPages: [
                { id: 'viewmodels/courses/courses' },
                { id: 'viewmodels/courses/course/create/course' },
                { id: 'viewmodels/courses/course/configure' },
                { id: 'viewmodels/courses/course/publish' },
                { id: 'viewmodels/courses/course/results' },
                { id: 'viewmodels/objectives/objective' },
                { id: 'viewmodels/questions/question' }
            ],
            modelToCompose: 'navigationBar/navigationBar'
        },
        {
            viewToCompose: 'editor/course/createBar',
            subscribedPages: [{ id: 'editor/course/index' }],
            modelToCompose: 'editor/course/index'
        },
        {
            viewToCompose: 'views/courses/course/design/bar',
            subscribedPages: [{ id: 'viewmodels/courses/course/design/design' }],
            modelToCompose: 'viewmodels/courses/course/design/design'
        },
        {
            viewToCompose: 'views/learningPaths/courseSelector/courseSelector',
            subscribedPages: [{ id: 'viewmodels/learningPaths/learningPath/details' }],
            modelToCompose: 'viewmodels/learningPaths/courseSelector/courseSelector',
            activate: true,
            activationData: 'id'
        }
    ];

    var viewModel = {
        initialize: initialize,
        bar: ko.observable(null),
        activate: function () { }
    };

    return viewModel;

    function initialize() {
        router.on('router:route:activating').then(function (instance) {
            var lastRouter = router;

            (function setBar(currentInstance) {
                if (currentInstance.router) {
                    var activationHandler = currentInstance.router.on('router:route:activating').then(function (childInstance, instruction, childRouter) {
                        activationHandler.off();
                        lastRouter = childRouter;
                        setBar(childInstance);
                    });

                } else {
                    var attachedHandler = lastRouter.on('router:navigation:attached').then(function () {
                        attachedHandler.off();
                        onViewModelAttached(currentInstance, lastRouter.activeInstruction().config.hash);
                    });
                }
            })(instance);

        });
    }

    function onViewModelAttached(instance, hash) {
        var view = false,
            model = false,
            activate = false,
            activationData = false;

        _.each(barsConfigurations, function (barConfig) {
            var bar = _.find(barConfig.subscribedPages, function (page) {
                var hashCorrect = true;
                if (page.pattern) {
                    hashCorrect = page.pattern.test(hash);
                }
                return page.id == instance.__moduleId__ && hashCorrect;
            });

            if (bar) {
                view = barConfig.viewToCompose;
                activate = barConfig.activate || false;

                if (_.isString(barConfig.activationData)) {
                    activationData = instance[barConfig.activationData];
                }

                if (_.isString(barConfig.modelToCompose)) {
                    model = barConfig.modelToCompose;
                }
            }
        });

        if ((_.isString(viewModel.bar()) && viewModel.bar() === view) || (_.isObject(viewModel.bar()) && viewModel.bar().view === view)) {
            return;
        }

        if (model) {
            viewModel.bar({ view: view, model: model, activate: activate, activationData: activationData, binding: binding, compositionComplete: compositionComplete });
            return;
        }
        viewModel.bar(view);
    }

    function binding(element) {
        element.style.visibility = 'hidden';
    }

    function compositionComplete(element) {
        element.style.visibility = 'visible';
    }

});
define(['plugins/router'], function (router) {
    'use strict';

    var barsConfigurations = [
        {
            path: 'navigationBar/navigationBar',
            viewmodels: [
                { id: 'viewmodels/courses/courses' },
                { id: 'viewmodels/courses/course/create/course' },
                { id: 'viewmodels/courses/course/configure' },
                { id: 'viewmodels/courses/course/publish' },
                { id: 'reporting/viewmodels/results' },
                { id: 'viewmodels/objectives/objective', pattern: /courses\/[\w]+\/objectives\/[\w]+/ },
                { id: 'viewmodels/questions/question', pattern: /courses\/[\w]+\/objectives\/[\w]+\/questions\/[\w]+/ }
            ],
            model: false
        },
        {
            path: 'views/courses/course/design/bar',
            viewmodels: [{ id: 'viewmodels/courses/course/design/design' }],
            model: true
        },
        {
            path: 'views/learningPaths/courseSelector/courseSelector',
            viewmodels: [{ id: 'viewmodels/learningPaths/learningPath/learningPath' }],
            model: 'viewmodels/learningPaths/courseSelector/courseSelector',
            activate: true,
            activationDataProperty: 'id'
        }
    ];

    var viewModel = {
        initialize: initialize,
        bar: ko.observable(null),
        activate: function () {

        }
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
            var bar = _.find(barConfig.viewmodels, function (viewmodel) {
                var hashCorrect = true;
                if (viewmodel.pattern) {
                    hashCorrect = viewmodel.pattern.test(hash);
                }
                return viewmodel.id == instance.__moduleId__ && hashCorrect;
            });

            if (bar) {
                view = barConfig.path;
                activate = barConfig.activate || false;

                if (_.isString(barConfig.activationDataProperty)) {
                    activationData = _.isFunction(instance[barConfig.activationDataProperty]) ? instance[barConfig.activationDataProperty]() : instance[barConfig.activationDataProperty];
                }

                if (_.isString(barConfig.model)) {
                    model = barConfig.model;
                    return;
                }

                if (barConfig.model) {
                    model = instance;
                }
            }
        });

        if (model) {
            viewModel.bar({ view: view, model: model, activate: activate, activationData: activationData });
            return;
        }
        viewModel.bar(view);
    }

});
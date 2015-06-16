define(['plugins/router'], function (router) {
    'use strict';

    var bars = [
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
                        var view = false,
                            model = false;

                        _.each(bars, function (barConfig) {
                            var bar = _.find(barConfig.viewmodels, function (viewmodel) {
                                var hashCorrect = true;
                                if (viewmodel.pattern) {
                                    hashCorrect = viewmodel.pattern.test(lastRouter.activeInstruction().config.hash);
                                }
                                return viewmodel.id == currentInstance.__moduleId__ && hashCorrect;
                            });

                            if (bar) {
                                view = barConfig.path;
                                if (barConfig.model) {
                                    model = currentInstance;
                                    return;
                                }
                                model = false;
                            }
                        });

                        if (model) {
                            viewModel.bar({ view: view, model: model, activate: false });
                            return;
                        }
                        viewModel.bar(view);
                    });
                }
            })(instance);

        });
    }
});
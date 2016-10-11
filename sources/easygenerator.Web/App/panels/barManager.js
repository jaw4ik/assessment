import app from 'durandal/app';
import constants from 'constants';
import router from 'plugins/router';
import ko from 'knockout';
import _ from 'underscore';

const barsConfigurations = [
    {
        viewToCompose: 'navigationBar/navigationBar',
        modelToCompose: 'navigationBar/navigationBar',
        subscribedPages: [
            { id: 'viewmodels/courses/courses' },
            { id: 'viewmodels/courses/course/create/course' },
            { id: 'viewmodels/courses/course/configure' },
            { id: 'viewmodels/courses/course/publish' },
            { id: 'viewmodels/courses/course/results' },
            { id: 'viewmodels/sections/section' },
            { id: 'viewmodels/questions/question' }
        ]
    },
    {
        viewToCompose: 'editor/course/createBar',
        modelToCompose: 'editor/course/index',
        subscribedPages: [{ id: 'editor/course/index' }]
    },
    {
        viewToCompose: 'design/bar',
        modelToCompose: 'design/design',
        subscribedPages: [{ id: 'design/design' }]
    },
    {
        viewToCompose: 'views/learningPaths/courseSelector/courseSelector',
        modelToCompose: 'viewmodels/learningPaths/courseSelector/courseSelector',
        subscribedPages: [{ id: 'viewmodels/learningPaths/learningPath/details' }],
        activate: true,
        activationData: 'id'
    },
    {
        viewToCompose: 'panels/contentBarWrapper',
        events: {
            toShow: constants.messages.content.startEditing,
            toHide: constants.messages.content.endEditing
        }
    }
];

class BarManager {
    constructor() {
        this.bar = ko.observable(null);
        this.previousBar = null;
        this.currentInstance = null;

        let that = this;
        router.on('router:route:activating').then(function (instance) {
            var lastRouter = router;
            that.currentInstance = instance;

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
                        that.onViewModelAttached(currentInstance, lastRouter.activeInstruction().config.hash);
                    });
                }
            })(instance);

        });

        _.each(barsConfigurations, barConfig => {
            if (_.isObject(barConfig.events)) {
                app.on(barConfig.events.toShow, () => this.showBar(barConfig, this.currentInstance));
                app.on(barConfig.events.toHide, () => this.bar(this.previousBar));
            }
        });
    }

    onViewModelAttached(instance, hash) {
        let config = _.find(barsConfigurations, barConfig => {
            return _.some(barConfig.subscribedPages, page => 
                page.id === instance.__moduleId__ && 
                (page.pattern ? page.pattern.test(hash) : true));
        });
         
        this.showBar(config, instance);
    }

    showBar(config, instance) {
        if (!_.isObject(config)) {
            this.bar(null);
            return;
        }

        if ((_.isString(this.bar()) && this.bar() === config.viewToCompose) || 
            (_.isObject(this.bar()) && this.bar().view === config.viewToCompose)) {
            return;
        }

        this.previousBar = this.bar();

        if (config.modelToCompose) {
            this.bar({
                view: config.viewToCompose,
                model: config.modelToCompose,
                activate: config.activate || false,
                activationData: instance[config.activationData],
                binding: this.binding,
                compositionComplete: this.compositionComplete
            });
        } else {
            this.bar({ model: {}, view: config.viewToCompose });
        }
    }

    binding(element) {
        element.style.visibility = 'hidden';
    }

    compositionComplete(element) {
        element.style.visibility = 'visible';
    }
}

export default new BarManager();
import composition from 'durandal/composition';
import ko from 'knockout';
import _ from 'underscore';
import attributesHelper from './../helpers/attributesHelper';
import DragulaContainer from './../dragulaContainer';

let dragulaContainer = new DragulaContainer();

ko.bindingHandlers.draggableContainer = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {

        let copy = ko.utils.unwrapObservable(valueAccessor().copy) || false,
            moveTo = ko.utils.unwrapObservable(valueAccessor().moveTo) || null,
            moveFrom = ko.utils.unwrapObservable(valueAccessor().moveFrom) || null,
            draggableArea = ko.utils.unwrapObservable(valueAccessor().draggableArea) || null,
            events = ko.utils.unwrapObservable(valueAccessor().events) || null,
            useTargetWidth = ko.utils.unwrapObservable(valueAccessor().useTargetWidth) || false,
            mirrorContainer = ko.utils.unwrapObservable(valueAccessor().mirrorContainer) || null;


        dragulaContainer.dragula.containers.push(element);
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => 
            dragulaContainer.dragula.containers = _.without(dragulaContainer.dragula.containers, element));

        if (copy) {
            dragulaContainer.sourcesToCopy.push(element);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => 
                dragulaContainer.sourcesToCopy = _.without(dragulaContainer.sourcesToCopy, element));
        }

        if (moveTo) {
            var targetsList = mapTargets(moveTo);

            registerTargets(targetsList);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => unregisterTargets(targetsList));
        }

        if (moveFrom) {
            var sourcesList = mapSources(moveFrom);

            registerSources(sourcesList);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => unregisterSources(sourcesList));
        }

        if (events) {
            var eventsList = wrapEvents(events);

            registerEvents(eventsList);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => unregisterEvents(eventsList));
        }

        if (draggableArea) {
            var area = { source: element, selector: draggableArea };
            
            dragulaContainer.draggableAreas.push(area);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => 
                dragulaContainer.draggableAreas = _.without(dragulaContainer.draggableAreas, area));
        }

        if (useTargetWidth) {
            dragulaContainer.elementsToUseTargetWidth.push(element);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => 
                dragulaContainer.elementsToUseTargetWidth = _.without(dragulaContainer.elementsToUseTargetWidth, element));
        }

        if (mirrorContainer) {
            var container = {
                source: element,
                selector: mirrorContainer
            };

            dragulaContainer.mirrorContainers.push(container);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => 
                dragulaContainer.mirrorContainers = _.without(dragulaContainer.mirrorContainers, container));
        }

        $(document).on('mousemove', mouseMoveHandler);
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            $(document).off('mousemove', mouseMoveHandler);
        });

        function mouseMoveHandler(e) {
            window.mouseXPos = e.clientX;
            window.mouseYPos = e.clientY;
        }

        function registerTargets(targets) {
            dragulaContainer.targetsToMove = dragulaContainer.targetsToMove.concat(targets);
        }

        function unregisterTargets(targets) {
            dragulaContainer.targetsToMove = _.difference(dragulaContainer.targetsToMove, targets);
        }

        function registerSources(sources) {
            dragulaContainer.sourcesFromMove = dragulaContainer.sourcesFromMove.concat(sources);
        }

        function unregisterSources(sources) {
            dragulaContainer.sourcesFromMove = _.difference(dragulaContainer.sourcesFromMove, sources);
        }

        function mapTargets(targets) {
            return _.map(targets, (handler, selector) => {
                let mappedTarget = {
                    source: element,
                    selector: selector
                };

                if (_.isFunction(handler)) {
                    mappedTarget.callback = handler.bind(bindingContext.$root);
                } else if (_.isObject(handler)) {
                    mappedTarget.callback = handler.callback.bind(bindingContext.$root);
                    mappedTarget.forbidDropToEnd = handler.forbidDropToEnd;
                }

                return mappedTarget;
            });
        }

        function mapSources(sources) {
            return _.map(sources, (handler, selector) => {
                let mappedTarget = {
                    target: element,
                    selector: selector
                };

                if (_.isFunction(handler)) {
                    mappedTarget.callback = handler.bind(bindingContext.$root);
                } else if (_.isObject(handler)) {
                    mappedTarget.callback = handler.callback.bind(bindingContext.$root);
                    mappedTarget.forbidDropToEnd = handler.forbidDropToEnd;
                }

                return mappedTarget;
            });
        }

        function registerEvents(events) {
            _.each(events, (event) => dragulaContainer.dragula.on(event.name, event.handler));
        }

        function unregisterEvents(events) {
            _.each(events, (event) => dragulaContainer.dragula.off(event.name, event.handler));
        }

        function wrapEvents(events) {
            return _.map(events, (handler, name) => {
                return {
                    name: name,
                    handler: function () {
                        var args = _.map(arguments, arg => attributesHelper.getDataAttribute(arg));
                        handler.apply(bindingContext.$data, args);
                    }
                };
            });
        }
    }
};

composition.addBindingHandler('draggableContainer');
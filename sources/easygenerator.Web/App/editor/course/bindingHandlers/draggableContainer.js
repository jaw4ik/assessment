import ko from 'knockout';
import _ from 'underscore';
import attributesHelper from 'editor/course/components/attributesHelper';
import DragulaContainer from 'editor/course/components/dragulaContainer';
import composition from 'durandal/composition';

ko.bindingHandlers.draggableContainer = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        let dragulaContainer = new DragulaContainer();

        let copy = ko.utils.unwrapObservable(valueAccessor().copy) || false,
            moveTo = ko.utils.unwrapObservable(valueAccessor().moveTo) || null,
            draggableArea = ko.utils.unwrapObservable(valueAccessor().draggableArea) || null,
            events = ko.utils.unwrapObservable(valueAccessor().events) || null;
		
        dragulaContainer.dragula.containers.push(element);
        dragulaContainer.dragula.mirrorContainer = document.getElementsByTagName('main')[0];

        if (copy) {
            dragulaContainer.sourcesToCopy.push(element);
        }

        if (moveTo) {
            registerTargets(moveTo);
        }

        if (events) {
            var eventsList = wrapEvents(events);

            registerEvents(eventsList);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => unregisterEvents(eventsList));
        }

        draggableArea && dragulaContainer.draggableAreas.push({
            source: element,
            selector: draggableArea
        });

        function registerTargets(targets) {
            for (let selector in targets) {
                if (targets.hasOwnProperty(selector)) {
                    dragulaContainer.targetsToMove.push({ source: element, selector: selector, handler: targets[selector].bind(bindingContext.$root) });
                }
            }
        }

        function registerEvents(events) {
            events.forEach(function(event) {
                dragulaContainer.dragula.on(event.name, event.handler);
            });
        }

        function unregisterEvents(events) {
            events.forEach(function(event) {
                dragulaContainer.dragula.off(event.name, event.handler);
            });
        }

        function wrapEvents(events) {
            var wrappedEvents = [];
            for (let event in events) {
                if (events.hasOwnProperty(event) && _.isFunction(events[event])) {
                    wrappedEvents.push({
                        name: event,
                        handler: function () {
                            var args = _.map(arguments, arg => attributesHelper.getDataAttribute(arg));
                            events[event].apply(bindingContext.$root, args);
                        }
                    });
                }
            }
            return wrappedEvents;
        }
    }
};

composition.addBindingHandler('draggableContainer');
import composition from 'durandal/composition';
import ko from 'knockout';
import _ from 'underscore';
import attributesHelper from 'editor/course/components/attributesHelper';
import DragulaContainer from 'editor/course/components/dragulaContainer';

let dragulaContainer = new DragulaContainer();
dragulaContainer.dragula.mirrorContainer = document.getElementsByTagName('main')[0];

ko.bindingHandlers.draggableContainer = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {

        let copy = ko.utils.unwrapObservable(valueAccessor().copy) || false,
            moveTo = ko.utils.unwrapObservable(valueAccessor().moveTo) || null,
            draggableArea = ko.utils.unwrapObservable(valueAccessor().draggableArea) || null,
            events = ko.utils.unwrapObservable(valueAccessor().events) || null,
            useTargetWidth = ko.utils.unwrapObservable(valueAccessor().useTargetWidth) || false;


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

        if (events) {
            var eventsList = wrapEvents(events);

            registerEvents(eventsList);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => unregisterEvents(eventsList));
        }

        dragulaContainer.dragula.on('shadow', (element, container) => {
            if (useTargetWidth) {
                let $mirrorElement = $(dragulaContainer.mirrorElement);
                $mirrorElement.addClass('used-target-width');
                $mirrorElement.width(container.offsetWidth);
                if (dragulaContainer.mirrorElement) {
                    let top = parseInt(dragulaContainer.mirrorElement.style.top);
                    let height = dragulaContainer.mirrorElement.offsetHeight;
                    let margin = window.mouseYPos - top;
                    if (margin > height) {
                        let indent = 10;
                        dragulaContainer.mirrorElement.style.setProperty('margin-top', `${(margin - indent)}px`, 'important');
                    }
                }
            }
        });

        $(document).on('mousemove', mouseMoveHandler);

        if (draggableArea) {
            var area = { source: element, selector: draggableArea };
            
            dragulaContainer.draggableAreas.push(area);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => 
                dragulaContainer.draggableAreas = _.without(dragulaContainer.draggableAreas, area));
        }

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
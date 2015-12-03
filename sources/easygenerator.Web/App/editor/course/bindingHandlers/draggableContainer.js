import ko from 'knockout';
import DragulaContainer from 'editor/course/components/dragulaContainer';
import composition from 'durandal/composition';

ko.bindingHandlers.draggableContainer = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        let dragulaContainer = new DragulaContainer();
        let copy = ko.utils.unwrapObservable(valueAccessor().copy) || false;
        let moveTo = ko.utils.unwrapObservable(valueAccessor().moveTo) || null;
        let draggableArea = ko.utils.unwrapObservable(valueAccessor().draggableArea) || null;
		let registerTargets = targets => {
		    for (let selector in targets) {
		        if (targets.hasOwnProperty(selector)) {
		            dragulaContainer.targetsToMove.push({ source: element, selector: selector, handler: targets[selector].bind(bindingContext.$root) });
		        }
		    }
		}
		
		dragulaContainer.dragula.containers.push(element);

		dragulaContainer.dragula.mirrorContainer = document.getElementsByTagName('main')[0];

		if (copy) {
		    dragulaContainer.sourcesToCopy.push(element);
	    }

		if (moveTo) {
		    registerTargets(moveTo);
	    }

	    draggableArea && dragulaContainer.draggableAreas.push({
	        source: element,
	        selector: draggableArea
	    });
	}
};

composition.addBindingHandler('draggableContainer');
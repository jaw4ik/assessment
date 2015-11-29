import ko from 'knockout';
import dragula from 'editor/course/bindingHandlers/dragulaContainer';

ko.bindingHandlers.draggableContainer = {
	init: (element, valueAccessors) => {
		let copy = ko.utils.unwrapObservable(valueAccessors.copy) || false;
		let moveTo = ko.utils.unwrapObservable(valueAccessors().moveTo) || null;
		let draggableArea = ko.utils.unwrapObservable(valueAccessors().draggableArea) || null;
		let registerTargets = targets => {
			for (let selector in targets) {
				dragula.targetsToMove.push({ source: element, selector: selector, handler: targets[selector] });
			}
		}
		
		dragula.containers.push(element);
		
		copy && dragula.sourcesToCopy.push(element);
		
		moveTo && registerTargets(moveTo);
		
		draggableArea && dragula.draggableAreas.push({
			source: element,
			selector: draggableArea
		})
	}
};
import ko from 'knockout';
import dragula from 'editor/course/components/dragulaContainer';
import attributesHelper from 'editor/course/components/attributesHelper';

ko.bindingHandlers.draggableData = {
	init: (element, valueAccessors) => {
		attributesHelper.setDataAttribute(element, valueAccessors());
	}
};
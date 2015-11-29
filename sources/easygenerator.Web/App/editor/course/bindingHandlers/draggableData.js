import ko from 'knockout';
import dragula from 'editor/course/bindingHandlers/dragulaContainer';
import attributesHelper from 'editor/course/components/attributesHelper';

ko.bindingHandlers.draggableData = {
	init: (element, valueAccessors) {
		attributesHelper.setDataAttribute(element, valueAccessors());
	}
};
import ko from 'knockout';
import attributesHelper from 'editor/course/components/attributesHelper';

ko.bindingHandlers.draggableData = {
	init: (element, valueAccessors) => {
		attributesHelper.setDataAttribute(element, valueAccessors());
	}
};
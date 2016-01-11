import ko from 'knockout';
import attributesHelper from 'editor/course/components/attributesHelper';

ko.bindingHandlers.draggableData = {
    update: (element, valueAccessors) => {
		attributesHelper.setDataAttribute(element, ko.toJS(valueAccessors()));
	}
};
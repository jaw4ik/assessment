import ko from 'knockout';
import attributesHelper from './../helpers/attributesHelper';

ko.bindingHandlers.draggableData = {
    update: (element, valueAccessors) => {
		attributesHelper.setDataAttribute(element, ko.toJS(valueAccessors()));
	}
};
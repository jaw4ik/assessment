export default class {
	constructor(){}
	getDataAttribute(element){
		if (!element) {
			return null;
		}

		var dataAttribute = element.attributes.getNamedItem('data-item');
		if (!dataAttribute) {
			return null;
		}
		
		return JSON.parse(dataAttribute.value);
	}
	setDataAttribute(element, data){
		let dataAttribute = document.createAttribute('data-item');
		dataAttribute.value = JSON.stringify(data);
		element.attributes.setNamedItem(dataAttribute);
	}
}

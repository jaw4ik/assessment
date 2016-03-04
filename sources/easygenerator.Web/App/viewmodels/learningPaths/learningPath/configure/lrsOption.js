export default class LrsOption {
    constructor(name, isSelected) {
        this.name = name;
        this.isSelected = ko.observable(isSelected === true);
    }
}
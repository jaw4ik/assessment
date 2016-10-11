import ko from 'knockout';
import constants from 'constants';
import ContentBase from './../ContentBase';

export default class extends ContentBase {
    constructor () {
        super();

        this.data = ko.observable(null);
        this.justCreated = false;
        this.contentType = constants.contentsTypes.imageInTheRight;
        this.editingEndedEventTrigger = ko.observable();
    }
    activate(data, justCreated) {
        this.data(data);
        this.justCreated = justCreated;
    }
    update(data) {
        this.data(data);
    }
    editingEnded() {
        this.editingEndedEventTrigger.valueHasMutated();
    }
}
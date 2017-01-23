import ko from 'knockout';
import ContentBase from './../ContentBase';

export default class extends ContentBase {
    constructor () {
        super();
        this.id = null;
        this.data = ko.observable(null);
        this.justCreated = false;
    }
    activate(data, justCreated, id) {
        this.id = id;
        this.data(data);
        this.justCreated = justCreated;
    }
    update(data) {
        this.data(data);
    }
}
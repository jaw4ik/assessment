import events from 'durandal/events';

export default class {
    constructor() {
        events.includeIn(this);       
    }

    created(content) {
        this.trigger('created', content);
    }

    deleted(contentId) {
        this.trigger('deleted', contentId);
    }

    updated(content) {
        this.trigger('updated', content);
    }
}
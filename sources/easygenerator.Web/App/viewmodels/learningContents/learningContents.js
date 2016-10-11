import _ from 'underscore';
import ko from 'knockout';

export default class {
    constructor() {
        this.questionId = null;
        this.isExpanded = ko.observable(true);
    }

    activate(questionId) {
        this.questionId = questionId;
    }

    toggleExpand() {
        this.isExpanded(!this.isExpanded());
    }
}
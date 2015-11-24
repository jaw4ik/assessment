import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';

export default class {
    constructor() {
        this.sectionExpanded = ko.observable(true);
        this.questionsExpanded = ko.observable(true);
    }
    toggleSection() {
        this.sectionExpanded(!this.sectionExpanded());
    }
    toggleQuestions() {
        this.questionsExpanded(!this.questionsExpanded());
    }
    activate() {
        debugger;
        this.sectionExpanded(true);
        this.questionsExpanded(true);
    }
}
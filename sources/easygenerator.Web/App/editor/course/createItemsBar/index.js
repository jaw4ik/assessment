import ko from 'knockout';
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
        this.sectionExpanded(true);
        this.questionsExpanded(true);
        for (let question of constants.questionTypes) {
            debugger;
        }
    }
}

export var __useDefault = true;
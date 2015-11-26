import ko from 'knockout';
import _ from 'underscore';

var mapQuestions = (questions) => _.map(questions, question => {
    return {
        title: question.title,
        type: question.type,
        canBeDeleted: ko.observable(false),
        markToDelete: self => self.canBeDeleted(true),
        cancel: self => self.canBeDeleted(false)
    };
});

export default class QuestionsViewModel {
    constructor (objectiveId, questions) {
        this.objectiveId = objectiveId;
        this.questions = ko.observableArray(mapQuestions(questions));
        this.notContainQuestions = ko.computed(() => this.questions().length === 0, this);
    }
}
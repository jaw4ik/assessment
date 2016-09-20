import _ from 'underscore';

class MultipleSelectAnswer {
    constructor(title, selected) {
        this.title = title;
        this.selected = selected;
    }
}

export default function() {
    let responseIds = this.lrsStatement.response && this.lrsStatement.response.split('[,]');
    let choices = this.lrsStatement.definition.choices;
    this.answers = [];

    if (_.isNullOrUndefined(responseIds)) {
        this.answers = _.map(choices, choice => new MultipleSelectAnswer(choice.description['en-US'], false));
    } else {
        this.answers = _.map(choices, choice => new MultipleSelectAnswer(choice.description['en-US'], _.some(responseIds, id => id === choice.id)));
    }
}
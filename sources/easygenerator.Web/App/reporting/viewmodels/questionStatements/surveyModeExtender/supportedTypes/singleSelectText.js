﻿import _ from 'underscore';

class SingleSelectAnswer {
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
        this.answers = _.map(choices, choice => new SingleSelectAnswer(choice.description['en-US'], false));
    } else {
        this.answers = _.map(choices, choice => new SingleSelectAnswer(choice.description['en-US'], _.some(responseIds, id => id === choice.id)));
    }

    this.csvResponse = _.chain(this.answers).filter(answer => answer.selected).map(answer => answer.title).value().join('; ');
}
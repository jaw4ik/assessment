import localizationManager from 'localization/localizationManager.js';
import * as getAnswers from './queries/getAnswers.js';
import * as addAnswerCommand from './commands/addAnswer.js';
import * as deleteAnswerCommand from './commands/deleteAnswer.js';
import * as updateAnswerTextCommand from './commands/updateAnswerText.js';
import * as updateAnswersOrderCommand from './commands/updateAnswersOrder.js';
import notify from 'notify.js';
import constants from 'constants';
import app from 'durandal/app';
import eventTracker from 'eventTracker';
import RankingTextAnswer from './rankingTextAnswer.js';

let minLengthOfAnswerOptions = 2,
    events = {
        addAnswer: 'Add ranking item',
        deleteAnswer: 'Delete ranking item',
        changeOrder: 'Change order of ranking items'
    };

class RankingText {

    constructor() {
        this.questionId = null;
        this.answers = ko.observableArray([]);
        this.isExpanded = ko.observable(true);

        this.showDeleteButton = ko.computed(() => {
            return this.answers().length > minLengthOfAnswerOptions;
        });
    }

    toggleExpand() {
        this.isExpanded(!this.isExpanded());
    }

    beginEditText(answer) {
        answer.text.isEditing(true);
    }
    
    endEditText(answer) {
        if (answer.isDeleted) {
            viewModel.answers.remove(answer);
            return;
        }

        answer.text(answer.text().trim());
        answer.text.isEditing(false);
        
        if (answer.text.original == answer.text()) {
            return;
        }

        return updateAnswerTextCommand.execute(answer.id, answer.text()).then(() => {
            answer.text.original = answer.text();
            notify.saved();
        }).catch(() => {
            answer.text(answer.text.original);
            notify.error(localizationManager.localize('failedToUpdateTextRankingItem'));
        });
    }

    removeAnswer(answer) {
        eventTracker.publish(events.deleteAnswer);
        return deleteAnswerCommand.execute(this.questionId, answer.id).then(() => {
            this.answers.remove(answer);
            notify.saved();
        }).catch(() => {
            notify.error(localizationManager.localize('failedToRemoveRankingItem'));
        });
    }

    addAnswer() {
        eventTracker.publish(events.addAnswer);
        return addAnswerCommand.execute(this.questionId).then(answer => {
            let answerViewModel = new RankingTextAnswer(answer.Id, answer.Text);
            answerViewModel.text.isEditing(true);
            this.answers.push(answerViewModel);
            
            notify.saved();
        }).catch(() => {
            notify.error(localizationManager.localize('failedToAddRankingItem'));
        });;
    }

    reorderAnswer(current, next) {
        eventTracker.publish(events.changeOrder);

        let currentId = current.id;
        let currentAnswer = _.find(this.answers(), answer => answer.id === currentId);
        this.answers.remove(currentAnswer);
        
        if (next && next.id) {
            let nextId = next.id;
            let nextAnswer = _.find(this.answers(), answer => answer.id === nextId);
            let nextAnswerIndex = this.answers.indexOf(nextAnswer);

            this.answers.splice(nextAnswerIndex, 0, currentAnswer);
        } else {
            this.answers.push(currentAnswer);
        }

        return updateAnswersOrderCommand.execute(this.questionId, this.answers()).then(() => {
            notify.saved();
        }).catch(() => {
            notify.error(localizationManager.localize('failedToReorderRankingItems'));
        });
    }

    answerCreatedByCollaborator(questionId, answerId, text) {
        if (this.questionId != questionId)
            return;

        this.answers.push(new RankingTextAnswer(answerId, text));
    }

    answerDeletedByCollaborator(questionId, answerId) {
        if (this.questionId != questionId)
            return;

        var answer = _.find(this.answers(), function (item) {
            return item.id == answerId;
        });
        if (_.isNullOrUndefined(answer))
            return;

        if (answer.text.isEditing()) {
            answer.isDeleted = true;
            notify.error(localizationManager.localize('answerOptionHasBeenDeletedByCollaborator'));
        } else {
            this.answers.remove(answer);
        }
    }

    answerTextChangedByCollaborator(questionId, answerId, text) {
        if (this.questionId != questionId)
            return;

        var answer = _.find(this.answers(), function (item) {
            return item.id == answerId;
        });
        if (_.isNullOrUndefined(answer))
            return;

        answer.text.original = text;
        if (!answer.text.isEditing())
            answer.text(text);
    }

    answersReorderedByCollaborator(questionId, answerIds) {
        if (this.questionId != questionId)
            return;

        let that = this;
        let answers = _.map(answerIds, function (id) {
            return _.find(that.answers(), function (item) {
                return item.id == id;
            });
        });
        this.answers(answers);
    }

    initialize(sectionId, question) {
        this.questionId = question.id;

        return getAnswers.execute(question.id).then((items) => {
            this.answers(_.map(items, function(answer) {
                return new RankingTextAnswer(answer.Id, answer.Text);
            }));

            return {
                viewCaption: localizationManager.localize('rankingTextEditor'),
                hasQuestionView: true,
                hasQuestionContent: true,
                hasFeedback: true
            }; 
        })
        .catch(() => {
            notify.error(localizationManager.localize('failedToGetRankingItems'));
        });
    }
}

let viewModel = new RankingText();

app.on(constants.messages.question.rankingText.answerCreatedByCollaborator, viewModel.answerCreatedByCollaborator.bind(viewModel));
app.on(constants.messages.question.rankingText.answerDeletedByCollaborator, viewModel.answerDeletedByCollaborator.bind(viewModel));
app.on(constants.messages.question.rankingText.answerTextChangedByCollaborator, viewModel.answerTextChangedByCollaborator.bind(viewModel));
app.on(constants.messages.question.rankingText.answersReorderedByCollaborator, viewModel.answersReorderedByCollaborator.bind(viewModel));

export default viewModel;
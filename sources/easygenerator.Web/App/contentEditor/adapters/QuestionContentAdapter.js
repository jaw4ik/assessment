import app from 'durandal/app';
import constants from 'constants';
import guard from 'guard';
import repository from 'repositories/learningContentRepository';
import AdapterBase from './AdapterBase';

export default class extends AdapterBase {
    constructor(questionId) {
        super();
        
        guard.throwIfNotString(questionId, 'Question id for \'QuestionContentAdapter\' not defined.');
        this.questionId = questionId;

        app.on(constants.messages.question.learningContent.createdByCollaborator, this.createdByCollaborator.bind(this));
        app.on(constants.messages.question.learningContent.deletedByCollaborator, this.deletedByCollaborator.bind(this));
        app.on(constants.messages.question.learningContent.updatedByCollaborator, this.updatedByCollaborator.bind(this));
    }

    async getContentsList() {
        return await repository.getCollection(this.questionId);
    }

    async updateContentPosition(contentId, position) {
        return await repository.updatePosition(this.questionId, contentId, position);
    }

    async updateContentText(contentId, text) {
        return await repository.updateText(this.questionId, contentId, text);
    }

    async createContent(contentType, position, text) {
        return await repository.addLearningContent(this.questionId, { text: text || '', position: position, type: contentType });
    }

    async deleteContent(contentId) {
        return await repository.removeLearningContent(this.questionId, contentId);
    }

    //#region Collaboration

    createdByCollaborator(question, content) {
        if (question.id === this.questionId) {
            this.created(content);
        }
    }

    deletedByCollaborator(question, contentId) {
        if (question.id === this.questionId) {
            this.deleted(contentId);
        }
    }

    updatedByCollaborator(question, content) {
        if (question.id === this.questionId) {
            this.updated(content);
        }
    }

    //#endregion
}
import _ from 'underscore';
import ko from 'knockout';
import app from 'durandal/app';
import constants from 'constants';
import binder from 'binder';
import adaptersLoader from './adapters/adaptersLoader';
import contentTypesFactory from './contentTypes/contentTypesFactory';
import eventTracker from 'eventTracker';
import notify from 'notify';

const events = {
    createContent: 'Create content',
    editContent: 'Edit content',
    reorderContent: 'Reorder content',
    duplicateContent: 'Duplicate content',
    deleteContent: 'Delete content',
    restoreContent: 'Restore content',
    startEditingContent: 'Start editing content',
    endEditingContent: 'End editing content'
};

export default class {
    constructor() {
        binder.bindClass(this);

        this.adapter = null;
        
        this.contentsList = ko.observableArray([]);
        this.dragging = ko.observable(false);
        this.showPlaceholders = ko.observable(false);
        this.activePlaceholderIndex = ko.observable(null);
        this.overlayEnabled = ko.observable(false);

        app.on(constants.messages.content.endEditing, this.endEditingContents);
        app.on(constants.messages.content.create, this.createContentFromPanel);
    }

    async activate(activationData) {
        if (_.isNullOrUndefined(activationData) || _.isNullOrUndefined(activationData.adapter)) {
            throw 'Adapter for content editor not defined.';
        }

        this.adapter = await adaptersLoader.load(activationData.adapter, activationData.adapterActivationData);
        if (_.isNull(this.adapter)) {
            throw 'Adapter for content editor not found. Adapter path: ' + activationData.adapter;
        }

        this.adapter.on('created', this.createdByCollaborator);
        this.adapter.on('deleted', this.deletedByCollaborator);
        this.adapter.on('updated', this.updatedByCollaborator);
        
        this.contentsList(await Promise.all(
            _.chain(await this.adapter.getContentsList())
            .sortBy(content => content.position)
            .map(content => this.mapContent(content))
            .value()
        ));
     
        this.activePlaceholderIndex(null);
    }

    async mapContent(content, justCreated) {
        let viewmodel = await contentTypesFactory.createContentViewmodel(content.type);

        viewmodel.on('save', (text) => this.saveContent(content, text));
        viewmodel.on('startEditing', () => this.startEditingContent(content));
        viewmodel.on('endEditing', () => this.endEditingContent(content));
        viewmodel.on('duplicateContent', () => this.duplicateContent(content));
        viewmodel.on('deleteContent', () => this.deleteContent(content));
        viewmodel.on('enableOverlay', () => this.enableOverlay());
        viewmodel.on('disableOverlay', () => this.disableOverlay());

        content.viewmodel = viewmodel;
        content.isActive = ko.observable(false);
        content.isDeleted = ko.observable(false);
        content.isDragging = ko.observable(false);
        content.justCreated = justCreated || false;
        content.setActive = () => {
            if (content.isActive()) {
                return;
            }

            eventTracker.publish(events.startEditingContent);
            content.isActive(true);
            app.trigger(constants.messages.content.startEditing);
        };
        content.setInactive = () => {
            if (!content.isActive()) {
                return;
            }

            eventTracker.publish(events.endEditingContent);
            content.isActive(false);
        };

        return content;
    }

    async saveContent(content, text) {
        if (content.text === text || this.contentsList.indexOf(content) === -1) {
            return;
        }
        
        eventTracker.publish(events.editContent);

        if (content.justCreated) {
            let createdContent = await this.adapter.createContent(content.type, content.position, text);
            content.id = createdContent.id;
            content.justCreated = false;
        } else {
            await this.adapter.updateContentText(content.id, text);
        }

        content.text = text;
        notify.saved();
    }
    startEditingContent(content) {
        _.chain(this.contentsList())
            .without(content)
            .each(content => content.setInactive());

        content.setActive();
    }
    endEditingContent(content) {
        content.setInactive();
    }
    async createContent(contentType, position, text) {
        if (_.isEmpty(text)) {
            return await this.mapContent({ type: contentType, position: position, text: text }, true);
        } else {
            return await this.mapContent(await this.adapter.createContent(contentType, position, text));
        }
    }
    async duplicateContent(content) {
        eventTracker.publish(events.duplicateContent);

        let contentIndex = this.contentsList.indexOf(content);
        let nextContent = this.contentsList()[contentIndex + 1];
        let newContentPosition = this._calculateNewContentPosition(content, nextContent);

        let newContent = await this.createContent(content.type, newContentPosition, content.text);
        this.contentsList.splice(contentIndex + 1, 0, newContent);
        notify.saved();
    }
    async deleteContent(content) {
        eventTracker.publish(events.deleteContent);

        if (_.isEmpty(content.text)) {
            this.contentsList.remove(content);
        } else {
            content.isDeleted(true);
            content.setInactive();
        }

        if (!content.justCreated) {
            await this.adapter.deleteContent(content.id);
            notify.saved();
        }
    }
    async restoreContent(content) {
        eventTracker.publish(events.restoreContent);
        
        let contentIndex = this.contentsList.indexOf(content);

        let previousContent = this.contentsList()[contentIndex - 1];
        let nextContent = this.contentsList()[contentIndex + 1];
        let newContentPosition = this._calculateNewContentPosition(previousContent, nextContent);

        let newContent = await this.createContent(content.type, newContentPosition, content.text);
        
        this.contentsList.splice(contentIndex, 1, newContent);
        notify.saved();
    }
    async createContentItem(contentType, nextContentPosition, targetIndex) {
        eventTracker.publish(events.createContent);
        
        let previousContent = this.contentsList()[targetIndex - 1];
        let nextContent = this.contentsList()[targetIndex];
        let newContentPosition = this._calculateNewContentPosition(previousContent, nextContent);

        let newContent = await this.createContent(contentType, newContentPosition, null);
        this.contentsList.splice(targetIndex, 0, newContent);

        this.activePlaceholderIndex(null);
    }
    async reorderContent(contentPosition, nextContentPosition) {
        eventTracker.publish(events.reorderContent);
        
        let content = _.find(this.contentsList(), content => content.position === contentPosition);
        if (_.isNullOrUndefined(content)) {
            return;
        }

        let contentIndex = this.contentsList.indexOf(content);
        this.contentsList.splice(contentIndex, 1);

        let nextContent = _.find(this.contentsList(), content => content.position === nextContentPosition);
        let previousContent = _.isObject(nextContent) ? this._getPreviousContent(nextContent) : _.last(this.contentsList());
        let newContentPosition = this._calculateNewContentPosition(previousContent, nextContent);
        let newContentIndex = _.isNull(nextContentPosition) ? this.contentsList().length : this.contentsList.indexOf(nextContent);

        if (!content.justCreated) {
            await this.adapter.updateContentPosition(content.id, newContentPosition);
            notify.saved();
        }
        content.position = newContentPosition;

        this.contentsList.splice(newContentIndex, 0, content);
        _.defer(() => content.isDragging(false));
    }
    startDragging(contentPosition) {
        this.dragging(true);
        
        let content = _.find(this.contentsList(), content => content.position === contentPosition);
        if (_.isObject(content)) {
            content.isDragging(true);
        } else {
            this.showPlaceholders(true);
            _.each(this.contentsList(), content => {
                content.setInactive();
                if (_.isFunction(content.viewmodel.editingEnded)) {
                    content.viewmodel.editingEnded();
                }
            });
        }
    }
    endDragging() {
        this.dragging(false);
        this.showPlaceholders(false);
        _.each(this.contentsList(), content => content.isDragging(false));
    }
    showPlaceholder(index) {
        this.activePlaceholderIndex(index);
        app.trigger(constants.messages.content.startEditing);
    }
    hidePlaceholder() {
        this.activePlaceholderIndex(null);
    }
    createContentFromPanel(contentType) {
        if (!_.isNull(this.activePlaceholderIndex())) {
            this.createContentItem(contentType, null, this.activePlaceholderIndex());
            return;
        }
     
        let activeContent = _.find(this.contentsList(), content => content.isActive());
        if (_.isNullOrUndefined(activeContent)) {
            return;
        }

        let activeContentIndex = this.contentsList.indexOf(activeContent);
        this.createContentItem(contentType, null, activeContentIndex + 1);
    }
    startCreatingContents() {
        this.showPlaceholder(0);
    }
    endEditingContents() {
        this.hidePlaceholder();
        _.each(this.contentsList(), content => {
            content.setInactive();
            if (_.isFunction(content.viewmodel.editingEnded)) {
                content.viewmodel.editingEnded();
            }
        });
    }
    enableOverlay() {
        this.overlayEnabled(true);
    }
    disableOverlay() {
        this.overlayEnabled(false);
    }

    //#region Collaboration

    async createdByCollaborator(content) {
        await this.checkAndCorrectPositionCollision(content);

        let previousContent = this._getPreviousContent(content);
        let newContentIndex = _.isObject(previousContent) ? this.contentsList.indexOf(previousContent) + 1 : 0;

        let mappedContent = await this.mapContent(content);
        this.contentsList.splice(newContentIndex, 0, mappedContent);
    }
    deletedByCollaborator(contentId) {
        var deletedContent = _.find(this.contentsList(), content => content.id === contentId);
        if (_.isNullOrUndefined(deletedContent)) {
            return;
        }

        this.contentsList.remove(deletedContent);
    }
    async updatedByCollaborator(content) {
        var updatedContent = _.find(this.contentsList(), _content => _content.id === content.id);
        if (_.isNullOrUndefined(updatedContent)) {
            this.createdByCollaborator(content);
            return;
        }
        
        if (updatedContent.position !== content.position) {
            await this.checkAndCorrectPositionCollision(content);

            let contentIndex = this.contentsList.indexOf(updatedContent);
            this.contentsList.splice(contentIndex, 1);
            
            updatedContent.position = content.position;

            let previousContent = this._getPreviousContent(updatedContent);
            let newContentIndex = _.isObject(previousContent) ? this.contentsList.indexOf(previousContent) + 1 : 0;

            this.contentsList.splice(newContentIndex, 0, updatedContent);
        }

        if (updatedContent.text !== content.text) {
            updatedContent.viewmodel.update(content.text);
            updatedContent.text = content.text;
        }
    }
    async checkAndCorrectPositionCollision(content) {
        let contentWithSamePosition = _.find(this.contentsList(), _content => _content.position === content.position);
        if (_.isObject(contentWithSamePosition)) {
            let correctedPosition = this._calculateNewContentPosition(this._getPreviousContent(contentWithSamePosition), contentWithSamePosition);
            await this.adapter.updateContentPosition(content.id, correctedPosition);
            content.position = correctedPosition;
        }
    }

    //#endregion

    _getPreviousContent(targetContent) {
        if (!_.isObject(targetContent)) {
            return null;
        }

        return _.chain(this.contentsList())
            .filter(content => content.position < targetContent.position)
            .max(content => content.position)
            .value();
    }
    _calculateNewContentPosition(previousContent, nextContent) {
        if (_.isObject(previousContent) && _.isObject(nextContent)) {
            return (previousContent.position + nextContent.position) / 2;
        }
        if (_.isObject(previousContent)) {
            return previousContent.position + 1;
        }
        if (_.isObject(nextContent)) {
            return nextContent.position - 1;
        }
        return 0;
    }
}
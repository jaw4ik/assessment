import ko from 'knockout';
import _ from 'underscore';
import binder from 'binder';
import constants from 'constants';
import contentEditorParser from './components/parser';
import TextEditor, { className as textEditorClassName } from '../editors/textEditor/index';
import VideoEditor, { className as videoEditorClassName } from '../editors/videoEditor/index';
import { getDefaultDataByType } from './components/defaultDataGenerator';
import uploadManager from 'videoUpload/uploadManager';

function checkCallbacksReqiredProperties(callbacks) {
    return _.isFunction(callbacks.startEditing) &&
        _.isFunction(callbacks.enableOverlay) &&
        _.isFunction(callbacks.disableOverlay) &&
        _.isFunction(callbacks.save);
};

export const errors = {
    callbacksIsNotProvided: 'Callbacks is not provided',
    callbacksMustProvideFunctions: 'Callback must provide functions: startEditing, enableOverlay, disableOverlay, save, editingEndedEventTrigger',
    justCreatedMustBeABoolean: 'justCrated must be a boolean value',
    dataMustBeObservable: 'data must be observable',
    contentTypeMustBeAStringAndOneOfAvailableTypes: 'Content type must be a string and one of available types'
};

export default class{
    constructor () {
        binder.bindClass(this);

        this.learningContentId = null;
        this.editorInstances = ko.observableArray([]);
        this.statuses = constants.storage.video.statuses;
        this.isEditing = ko.observable(false);
        this.contentType = '';
        this.callbacks = null;
    }

    activate(id, data, justCreated, contentType, callbacks) {
        this.learningContentId = id;

        if (!_.isFunction(data)) {
            throw errors.dataMustBeObservable;
        }

        if (!_.isBoolean(justCreated)) {
            throw errors.justCreatedMustBeABoolean;
        }

        if (!_.isString(contentType) || !_.contains(constants.contentsTypes, contentType)) {
            throw errors.contentTypeMustBeAStringAndOneOfAvailableTypes;
        }

        if (!_.isObject(callbacks)) {
            throw errors.callbacksIsNotProvided;
        }

        if (!checkCallbacksReqiredProperties(callbacks)) {
            throw errors.callbacksMustProvideFunctions;
        }

        this.callbacks = callbacks;
        
        if (justCreated || !data().length) {
            data(getDefaultDataByType(contentType));
        }

        data.subscribe(value => this.setData(value));

        this.contentType = contentType;
        this.setData(data, justCreated);

        if (justCreated) {
            this.saveData(justCreated);
        }
    }

    setData(data, justCreated) {
        this.editorInstances.removeAll();

        let editorInstances = null;
        if (justCreated) {
            editorInstances = data();
        } else {
            let parsedData = contentEditorParser.parse(ko.unwrap(data));
            editorInstances = parsedData.output;
            this.contentType = parsedData.contentType;
        }
        _.each(editorInstances, column => {
            let columnsArray = [];

            _.each(column, row => {
                let tempInstance = this._createInstance(row.type, row.data);
                this.setVideoEditorOnFocus(tempInstance, justCreated);
                columnsArray.push(tempInstance);
            });
            this.editorInstances.push(columnsArray);
        });
    }

    setVideoEditorOnFocus(instance, justCreated) {
        if (instance instanceof VideoEditor && !this.isEditing() && justCreated) {
            this.isEditing(true);
            instance.startEditMode();
        }
    }

    _createInstance(type, data) {
        switch (type) {
            case textEditorClassName:
                return new TextEditor(data,
                {
                    save: this.saveData,
                    startEditing: this.callbacks.startEditing
                });
            case videoEditorClassName:
                {
                    let videoEditorInstance = new VideoEditor(data,
                        {
                            save: this.saveData,
                            startEditing: this.callbacks.startEditing,
                            endEditing: this.callbacks.endEditing,
                            enableOverlay: this.callbacks.enableOverlay,
                            disableOverlay: this.callbacks.disableOverlay,
                            changeType: this.changeType,
                            broadcastToOthereditorInstances: this.broadcastToOthereditorInstances
                        },
                        this.learningContentId,
                        this.contentType);

                    if (this.learningContentId !== null)
                        uploadManager.editorsForUpdate.push(videoEditorInstance);

                    return videoEditorInstance;
                }
        }
    }

    endEditing() {
        _.chain(this.editorInstances())
            .flatten()
            .each(instance => {
                if (instance instanceof VideoEditor) {
                    instance.stopEditMode();
                }
                if (instance instanceof TextEditor) {
                    instance.hasFocus(false);
                }
            });
    }

    saveData(justCreated) {
        var output = contentEditorParser.toHtml(this.editorInstances(), this.contentType);
        if (!justCreated) { return this.callbacks.save(output); } 

        this.callbacks.save(output, (responseLearningContent) => {
            let videoEditorInstance = this.getVideoAndTextInstance(this.editorInstances()).videoInstance;
            videoEditorInstance.associatedLearningContentId = responseLearningContent.id;

            uploadManager.editorsForUpdate.push(videoEditorInstance);
        }.bind(this));
    }

    changeType(contentType) {
        let videoAndTextInstance = null;
        switch (contentType) {
            case constants.contentsTypes.videoInTheLeft:
                videoAndTextInstance = this.getVideoAndTextInstance(this.editorInstances());
                this.editorInstances([[videoAndTextInstance.videoInstance], [videoAndTextInstance.textInstance]]);
                break;
            case constants.contentsTypes.videoInTheRight:
                videoAndTextInstance = this.getVideoAndTextInstance(this.editorInstances());
                this.editorInstances([[videoAndTextInstance.textInstance], [videoAndTextInstance.videoInstance]]);
                break;
            case constants.contentsTypes.videoWithText:
                videoAndTextInstance = this.getVideoAndTextInstance(this.editorInstances());
                this.editorInstances([[videoAndTextInstance.videoInstance, videoAndTextInstance.textInstance]]);
                break;
        }
        this.contentType = contentType;
    }

    getVideoAndTextInstance(editorInstances) {
        let videoInstance = null,
            textInstance = null;

        _.chain(editorInstances)
            .flatten()
            .each(instance => {
                if (instance instanceof VideoEditor) {
                    videoInstance = instance;
                }
                if (instance instanceof TextEditor) {
                    textInstance = instance;
                }
            });

        return {
            videoInstance,
            textInstance
        };
    }
}
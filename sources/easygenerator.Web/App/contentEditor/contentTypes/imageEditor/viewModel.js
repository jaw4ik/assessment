import ko from 'knockout';
import _ from 'underscore';
import binder from 'binder';
import constants from 'constants';
import contentEditorParser from './components/Parser';
import TextEditor, { className as textEditorClassName } from '../editors/textEditor/index';
import ImageEditor, { className as imageEditorClassName } from '../editors/imageEditor/index';
import { getDefaultDataByType } from './components/defaultDataGenerator';

export const errors = {
    callbacksIsNotProvided: 'Callbacks is not provided',
    callbacksMustProvideFunctions: 'Callback must provide functions: startEditing, enableOverlay, disableOverlay, save, editingEndedEventTrigger',
    justCreatedMustBeABoolean: 'justCrated must be a boolean value',
    dataMustBeObservable: 'data must be observable',
    contentTypeMustBeAStringAndOneOfAvailableTypes: 'Content type must be a string and one of available types'
};

function checkCallbacksReqiredProperties(callbacks) {
    return ko.isObservable(callbacks.editingEndedEventTrigger) &&
        _.isFunction(callbacks.startEditing) &&
        _.isFunction(callbacks.enableOverlay) &&
        _.isFunction(callbacks.disableOverlay) &&
        _.isFunction(callbacks.save);
}

export default class{
    constructor () {
        binder.bindClass(this);

        this.instances = ko.observableArray([]);
        this.isEditing = ko.observable(false);
        this.contentType = '';
        this.callbacks = null;
    }
    activate(data, justCreated, contentType, callbacks) {
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
        this.callbacks.editingEndedEventTrigger.subscribe(this.endEdit);

        if(justCreated || !data().length) {
            data(getDefaultDataByType(contentType));
        }

        data.subscribe(value => this.setData(value));

        this.contentType = contentType;
        this.setData(data, justCreated);
        if (justCreated) {
            this.saveData();
        }
    }
    setData(data, justCreated) {
        this.instances.removeAll();

        let instances = null;
        if (justCreated) {
            instances = data();
        } else {
            let parsedData = contentEditorParser.parse(ko.unwrap(data));
            instances = parsedData.output;
            this.contentType = parsedData.contentType;
        }

        _.each(instances, column => {
            let columnsArray = [];
            _.each(column, row => {
                let tempInstance = this._createInstance(row.type, row.data);
                if(tempInstance instanceof TextEditor && !this.isEditing() && justCreated) {
                    this.isEditing(true);
                    tempInstance.callbacks.startEditing();
                    tempInstance.hasFocus(true);
                }
                columnsArray.push(tempInstance);
            });
            this.instances.push(columnsArray);
        });
    }
    _createInstance(type, data) {
        switch (type) {
            case textEditorClassName:
                return new TextEditor(data, {
                    save: this.saveData,
                    startEditing: this.callbacks.startEditing
                });
            case imageEditorClassName:
                return new ImageEditor(data, {
                    save: this.saveData,
                    startEditing: this.callbacks.startEditing,
                    enableOverlay: this.callbacks.enableOverlay,
                    disableOverlay: this.callbacks.disableOverlay,
                    changeType: this.changeType,
                    broadcastToOtherInstances: this.broadcastToOtherInstances
                }, this.contentType);
        }
    }
    endEdit() {
        _.chain(this.instances())
            .flatten()
            .each(instance => {
                if(instance instanceof ImageEditor) {
                    instance.stopResizing();
                    instance.stopEditMode();
                }
                if(instance instanceof TextEditor){
                    instance.hasFocus(false);
                }
            });
    }
    saveData() {
        var output = contentEditorParser.toHtml(this.instances(), this.contentType);
        this.callbacks.save(output);
    }
    changeType(contentType) {
        let imageAndTextInstance = null;
        switch(contentType){
            case constants.contentsTypes.imageEditorOneColumn:
                imageAndTextInstance = getImageAndTextInstance(this.instances());
                this.instances([[imageAndTextInstance.imageInstance, imageAndTextInstance.textInstance]]);
                break;
            case constants.contentsTypes.imageInTheLeft:
                imageAndTextInstance = getImageAndTextInstance(this.instances());
                this.instances([[imageAndTextInstance.imageInstance], [imageAndTextInstance.textInstance]]);
                break;
            case constants.contentsTypes.imageInTheRight:
                imageAndTextInstance = getImageAndTextInstance(this.instances());
                this.instances([[imageAndTextInstance.textInstance], [imageAndTextInstance.imageInstance]]);
                break;
            case constants.contentsTypes.imageEditorTwoColumns:
                this.instances()[1][0].isEditMode(!this.instances()[1][0].isEditMode());
                this.instances()[0][0].isEditMode(!this.instances()[0][0].isEditMode());
                this.instances([[
                    this.instances()[1][0], this.instances()[1][1]
                ],[
                    this.instances()[0][0], this.instances()[0][1]
                ]]);
                break;
        }
        this.contentType = contentType;

        function getImageAndTextInstance(instances){
            let imageInstance = null,
                textInstance = null;

            _.chain(instances)
                .flatten()
                .each(instance => {
                    if(instance instanceof ImageEditor){
                        imageInstance = instance;
                    }
                    if(instance instanceof TextEditor){
                        textInstance = instance;
                    }
                });
            
            return {
                imageInstance,
                textInstance
            };
        }
    }
    broadcastToOtherInstances(broadcaster, messageType, data) {
        switch (messageType) {
            case 'sizeChanged':
                this._instanceSizeChanged(broadcaster, data.width, data.height);
                break;
            case 'resizingStopped':
                this._instanceResizingStopped(broadcaster);
                break;
        }
        
    }
    _instanceSizeChanged(broadcaster, width, height) {
        _.chain(this.instances())
            .flatten()
            .each(instance => {
                if (instance instanceof ImageEditor && instance !== broadcaster) {
                    instance.sizeChangedByAnotherInstance(width, height);
                }
            });
    }
    _instanceResizingStopped(broadcaster) {
        _.chain(this.instances())
            .flatten()
            .each(instance => {
                if (instance instanceof ImageEditor && instance !== broadcaster) {
                    instance.save();
                }
            });
    }
}
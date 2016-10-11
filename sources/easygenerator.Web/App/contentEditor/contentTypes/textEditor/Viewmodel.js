import ko from 'knockout';
import _ from 'underscore';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';

import * as parser from './components/textEditorParser';

export default class {
    constructor(){
        this.instances = [];
        this.callbacks = null;
        this.endEditing = this.endEditing.bind(this);
        this.save = this.save.bind(this);
        this.localizationManager = localizationManager;
        this.eventTracker = eventTracker;
        this.autosaveInterval = constants.autosaveTimersInterval.learningContent;
        this.isEditing = ko.observable(false);
    }

    activate(data, justCreated, callbacks) {
        if(_.isObject(callbacks)){
            this.callbacks = callbacks;
        }
        data.subscribe(value => {
            this.setData(value);
        });
        this.setData(data, justCreated);
    }

    setData(data, justCreated){
        let parsedData = justCreated ? data() : parser.initialize(ko.utils.unwrapObservable(data));
        if(!this.instances.length){
            _.each(parsedData, column =>{ 
                this.instances.push(new TextEditor(column, this.save.bind(this)));
            });
        }
        else{
            _.each(parsedData, (column, index)=>{ 
                this.instances[index].data(column);
            });
        }

        if(justCreated){
            this.instances[0].hasFocus(true);
        }
    }

    save(){
        let dataSet = _.map(this.instances, i=>{
            return i.data();
        });

        let preparedData = parser.updateTextEditorContent(dataSet);
        this.callbacks.save(preparedData);
    }

    endEditing(){
        if(this.isEditing()){
            _.each(this.instances, i =>{
                i.hasFocus(false);
            });
            this.isEditing(false);
            this.callbacks.endEditing();
        }
    }

    startEditing(instance){
        if(!this.isEditing()){
            this.isEditing(true);
            this.callbacks.startEditing();
        }
        instance.hasFocus(true);
    }
}

export class TextEditor {
    constructor(text, save) {
        this.data = ko.observable(text);
        this.hasFocus = ko.observable(false);
        this.isTextEditor = true;
        this.callbacks = {
            save: save
        }
        this.save = this.save.bind(this);
    }

    save(data) {
        this.data(data);
        this.callbacks.save();
    }
}
import ko from 'knockout';
import _ from 'underscore';
import $ from 'jquery';
import binder from 'binder';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';
import utils from 'utils/observableHelpers';

import './bindingHandlers/hasfocusBindingHandler';
import './bindingHandlers/enterKeyDownBindingHandler';

import * as hellip from './components/hellip';
import * as parser from './components/templateParser';

import getMap from './content/map.js';
import { getProvider } from './microformat/provider.js';

const events = {
    addLinkCuration: 'Add "Link (curation)" block'
}

export default class {
    constructor() {
        binder.bindClass(this);
        this.instance = null;
        this.callbacks = null;
        this.localizationManager = localizationManager;
        this.eventTracker = eventTracker;
        this.autosaveInterval = constants.autosaveTimersInterval.learningContent;
        this.isEditing = ko.observable(false);

        //TODO: fix outside click focus
        let $html = $('html');
        _.defer(() => $html.trigger('click'));
    }

    activate(data, justCreated, callbacks) {
        if(_.isObject(callbacks)) {
            this.callbacks = callbacks;
        }
        data.subscribe(value => {
            this.setData(value);
        });
        this.setData(data, justCreated);
    }

    setData(data, justCreated) {
        let parsedData = justCreated ? data() : parser.initialize(ko.utils.unwrapObservable(data));
        if(_.isNull(this.instance)) { 
            let linkInstanse = null;
           
            if(!_.isNull(parsedData)) { 
                linkInstanse = new LinkEditor(parsedData, this.save);
                linkInstanse.isLinkEditing(false);
                linkInstanse.parsed(true);
            } else {
                linkInstanse = new LinkEditor(undefined, this.save);
                //call event if addLinkCuration first time
                this.eventTracker.publish(events.addLinkCuration);
            }
            this.instance = linkInstanse;
        } else { 
            utils.cloneObservables(parsedData, this.instance.map);
        }
        if(justCreated) {
            this.startEditing();
        }
    }
    
    save() {
        let mapper =  ko.toJSON(this.instance.map);
        let preparedData = parser.updateBeforeStore(JSON.parse(mapper));
        this.callbacks.save(preparedData);
    }

    endEditing() {
        if(this.isEditing()) {
            this.instance.hasFocus(false);
            
            if (this.instance._isValidLink(this.instance.map.url())) {
                if (this.instance.isLinkEditing() || !this.instance.parsed()) {
                    this.instance.getCurationLink(this.instance.map.url());
                } else this.save();
            } 
            this.isEditing(false);
            this.callbacks.endEditing();
        }
    }

    startEditing() {
        if(!this.isEditing()) {
            this.isEditing(true);
            this.callbacks.startEditing();
        }
        _.defer(() => this.instance.hasFocus(true));
    }
}

export class LinkEditor {
    constructor(mapInitObject, save) {
        binder.bindClass(this);

        this._provider = getProvider();
        this.map = getMap(mapInitObject);

        this.hasFocus = ko.observable(false);
        this.isInProcess = ko.observable(false);
        this.isLinkEditing = ko.observable(false);
        this.isValidUrl = ko.observable(true);
        this.parsed = ko.observable(false);
        //need it when we save just description we shuold know how to display url block
        this.isFullfield = ko.pureComputed(() => {
            return (this.map.title().length !== 0 || 
                    this.map.description().length !== 0 || 
                    this.map.selectedImage().length !== 0) ? true : false;
        });
        this.callbacks = {
            save: save 
        }
    }

    _isValidLink(url) {
        if (_.isEmpty(url)) return false;
        
        let regex = new RegExp(constants.linkCuration.regexExpression);
        if (url.match(regex)) {
            return true;
        }
        return false;    
    }

    _isContainHttpWww(url) {
        url = (url.indexOf('://') == -1) ? 'https://' + url : url;
        return url;
    }
    
    async getCurationLink(url) {
        this.parsed(false);
        try {    
            this.isValidUrl(this._isValidLink(url));
            
            if(this.isValidUrl()) {
                this.map.url(this._isContainHttpWww(url));
                url = this.map.url();

                this.isInProcess(true);
                let microformat = await this._provider.parseLink(url);
                
                if(!!microformat) {
                    this.map.title(microformat.title);
                    this.map.description(hellip.cut(microformat.description, 128));
                    this.map.images(!microformat.images.length ? [constants.linkCuration.defaultImage] : microformat.images);
                    this.map.selectedImage(this.map.images()[0]);
                } else {
                    this.map.title('');
                    this.map.description('');
                    this.map.images([constants.linkCuration.defaultImage]);
                    this.map.selectedImage(this.map.images()[0]);
                }

                this.isLinkEditing(false);
                this.isInProcess(false);
                this.parsed(true);
                this.callbacks.save();
            } else {
                this.isValidUrl(true);   
                setTimeout(() => { 
                    this.isValidUrl(false);   
                }, 4);
            } 
        } catch(ex) { } 
    }

    editLink() { 
        this.isLinkEditing(true);
        this.hasFocus(true);
        this.hasFocus.valueHasMutated();
    }

    useExample() {
        let urlIndex = Math.floor(Math.random() * constants.linkCuration.urls.length);
        this.map.url(constants.linkCuration.urls[urlIndex]);
        this.getCurationLink(this.map.url());
    }
}



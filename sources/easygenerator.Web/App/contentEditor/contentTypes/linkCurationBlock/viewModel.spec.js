import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';

import * as parser from './components/templateParser';
import provider from './microformat/provider';

import Viewmodel from 'contentEditor/contentTypes/linkCurationBlock/Viewmodel';
import {LinkEditor} from 'contentEditor/contentTypes/linkCurationBlock/Viewmodel';
import {Provider} from './microformat/provider';

describe('[linkCuration Viewmodel]', () => {
    
    let callbacks = {
        startEditing: () => {},
        endEditing: () => {},
        save: () => {}
    };

    let viewmodel;
    beforeEach(() => {
        viewmodel = new Viewmodel();
    });

    describe('instance', () =>{
        
        it('should be null', ()=>{
            expect(viewmodel.instance).toBeNull();
        });

    });

    describe('localizationManager:', () => {

        it('should be defined', () => {
            expect(viewmodel.localizationManager).toBeDefined();
        });

    });

    describe('eventTracker:', () => {

        it('should be defined', () => {
            expect(viewmodel.eventTracker).toBeDefined();
        });

    });

    describe('autosaveInterval:', () => {

        it('should be defined', () => {
            expect(viewmodel.autosaveInterval).toBe(constants.autosaveTimersInterval.learningContent);
        });

    });

    describe('activate', ()=>{
    
        it('should be function',() => {
            expect(viewmodel.activate).toBeFunction();
        });

        it('should set callbacks', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, false, callbacks);
            expect(viewmodel.callbacks).toBeDefined();
            expect(viewmodel.callbacks).toEqual(callbacks);
        });

        it('should set data', () => {
            spyOn(viewmodel, 'setData');
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, false, callbacks);
            expect(viewmodel.setData).toHaveBeenCalledWith(newData, false);
        });

    });
    
    describe('setData', ()=>{
        
        it('should be function', ()=>{
            expect(viewmodel.setData).toBeFunction();
        });

        describe('when editor instances are not initialized', ()=>{
            
            it('should create editor instances', ()=>{
                let newData = ko.observable(parser.template.linkCuration);
                viewmodel.activate(newData, true, callbacks);
                expect(viewmodel.instance).not.toBe(null);
            });

        });

        describe('when block is just created', ()=>{

            it('should not call parse function', ()=>{
                spyOn(parser, 'initialize');
                let newData = ko.observable(parser.template.linkCuration);
                viewmodel.activate(newData, true, callbacks);
                viewmodel.setData(newData, true);
                expect(parser.initialize).not.toHaveBeenCalled();
            });

            it('should create instance of editor', ()=>{
                let newData = ko.observable(parser.template.linkCuration);
                viewmodel.activate(newData, true, callbacks);
                viewmodel.setData(newData, true);
                expect(viewmodel.instance).not.toBe(null);
            });
            
        });

    });

    describe('save', ()=>{
    
        it('should be function', ()=>{
            expect(viewmodel.save).toBeFunction();
        });

        it('should call parse data function', ()=>{
            spyOn(parser, 'updateBeforeStore');
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            viewmodel.save();
            expect(parser.updateBeforeStore).toHaveBeenCalled();
        });

        it('should call save callback', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            spyOn(viewmodel.callbacks, 'save');
            viewmodel.save();
            expect(viewmodel.callbacks.save).toHaveBeenCalled();
        });

    });

    describe('endEditing', ()=>{
        
        it('should be function', ()=>{
            expect(viewmodel.endEditing).toBeFunction();
        });

        describe('when current element is not editing', ()=>{
            it('should not call endEditing callback', ()=>{
                let newData = ko.observable(parser.template.linkCuration);
                viewmodel.activate(newData, true, callbacks);
                spyOn(viewmodel.callbacks, 'endEditing');
                viewmodel.isEditing(false);
                viewmodel.endEditing();
                expect(viewmodel.callbacks.endEditing).not.toHaveBeenCalled();
            });
        });

        describe('when current element is editing', ()=>{
            it('should stop editing', ()=>{
                let newData = ko.observable(parser.template.linkCuration);
                viewmodel.activate(newData, true, callbacks);
                viewmodel.endEditing();
                expect(viewmodel.isEditing()).toBeFalsy();
            });

            it('should remove focus from every editor instance', ()=>{
                let newData = ko.observable(parser.template.linkCuration);
                viewmodel.activate(newData, true, callbacks);
                viewmodel.endEditing();
                expect(viewmodel.instance.hasFocus()).toBeFalsy();
            });

            it('should call end editing callback', ()=>{
                let newData = ko.observable(parser.template.linkCuration);
                viewmodel.activate(newData, true, callbacks);
                spyOn(viewmodel.callbacks, 'endEditing');
                viewmodel.endEditing();
                expect(viewmodel.callbacks.endEditing).toHaveBeenCalled();
            });

        });

    });

    describe('startEditing', ()=>{

        it('should be function', ()=>{
            expect(viewmodel.startEditing).toBeFunction();
        });

        it('should set focus current instance', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance.hasFocus).toBeTruthy();
        });

    });

    describe('_isValidLink', ()=>{
        
        it('should be function', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance._isValidLink).toBeFunction();
        });

        it('should return false', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance._isValidLink('google')).toBeFalsy();
            expect(viewmodel.instance._isValidLink('')).toBeFalsy();
            expect(viewmodel.instance._isValidLink('www.google')).toBeFalsy();
            expect(viewmodel.instance._isValidLink('https://www.google')).toBeFalsy();
            expect(viewmodel.instance._isValidLink('google.')).toBeFalsy();
            expect(viewmodel.instance._isValidLink('https://google')).toBeFalsy();
        });

        it('should return true', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance._isValidLink('google.com')).toBeTruthy();
            expect(viewmodel.instance._isValidLink('https://google.com')).toBeTruthy();
            expect(viewmodel.instance._isValidLink('https://www.google.com')).toBeTruthy();
        });

    });

    describe('_isContainHttpWww', ()=>{
            
        it('should be function', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance._isContainHttpWww).toBeFunction();
        });

        it('should add https://', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance._isContainHttpWww('google.com')).toContain("https://");
        });

    });   

    describe('editLink', ()=>{

        it('should be function', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance.editLink).toBeFunction();
        });

        it('should set focus and linkEditing to true', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            viewmodel.instance.editLink();
            expect(viewmodel.instance.hasFocus).toBeTruthy();
            expect(viewmodel.instance.isLinkEditing).toBeTruthy();
        });

    });    

    describe('useExample', ()=>{

        it('should be function', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance.useExample).toBeFunction();
        });

        it('should call getCuration', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            spyOn(viewmodel.instance, 'useExample');
            viewmodel.instance.useExample();
            expect(viewmodel.instance.useExample).toHaveBeenCalled();
        });

    });     

    describe('provider', ()=>{

        it('should be instance of Provider', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance._provider instanceof Provider).toBeTruthy();
        });

        it('should return microformat when call parseLink', ()=>{
            let newData = ko.observable(parser.template.linkCuration);
            viewmodel.activate(newData, true, callbacks);
            expect(viewmodel.instance._provider.parseLink('https://google.com')).not.toBe(false);
        });

    });
});
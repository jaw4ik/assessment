import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';

import * as parser from './components/textEditorParser';

/*import Viewmodel from 'contentEditor/contentTypes/textEditor/viewModel';
import {TextEditor} from 'contentEditor/contentTypes/textEditor/viewModel';

describe('[textEditor Viewmodel]', () => {

    var viewmodel;
    beforeEach(() => {
        viewmodel = new Viewmodel();
    });

    describe('instances', () =>{
        
        it('should be array', ()=>{
            expect(viewmodel.instances).toBeArray();
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
            let newData = ko.observable('newData');
            let justCreated = false;
            let callbacks ={};
            viewmodel.activate(newData, justCreated, callbacks);
            expect(viewmodel.callbacks).toBeDefined();
            expect(viewmodel.callbacks).toEqual(callbacks);
        });

        it('should set data', () => {
            spyOn(viewmodel, 'setData');
            let newData = ko.observable('newData');
            let justCreated = false;
            viewmodel.activate(newData, justCreated);
            expect(viewmodel.setData).toHaveBeenCalledWith(newData, justCreated);
        });

    });
    
    describe('setData', ()=>{
    
        it('should be function', ()=>{
            expect(viewmodel.setData).toBeFunction();
        });

        describe('when editor instances are not initialized', ()=>{
            
            it('should create editor instances', ()=>{
                let newData = ko.observable(['newData1','newData2']);
                let justCreated = true;
                viewmodel.setData(newData, justCreated);
                expect(viewmodel.instances.length).toEqual(2);
            });

        });

        describe('when block is just created', ()=>{

            it('should not call parse function', ()=>{
                spyOn(parser, 'initialize');
                let newData = ko.observable(['newData']);
                let justCreated = true;
                viewmodel.setData(newData, justCreated);
                expect(parser.initialize).not.toHaveBeenCalled();

            });

            it('should create instance of editor', ()=>{
                let newData = ko.observable(['newData']);
                let justCreated = true;
                viewmodel.setData(newData, justCreated);
                expect(viewmodel.instances.length).toEqual(1);
            });
            
        });

    });

    describe('save', ()=>{
    
        it('should be function', ()=>{
            expect(viewmodel.save).toBeFunction();
        });

        it('should call parse data function', ()=>{
            spyOn(parser, 'updateTextEditorContent');
            let newData = ko.observable(['newData']);
            let justCreated = true;
            viewmodel.activate(newData, justCreated, {save:()=>{}});
            viewmodel.save();
            expect(parser.updateTextEditorContent).toHaveBeenCalled();
        });

        it('should call save callback', ()=>{
            let newData = ko.observable(['newData']);
            let justCreated = true;
            viewmodel.activate(newData, justCreated, {save:()=>{}});
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
                let newData = ko.observable(['newData']);
                let justCreated = true;
                viewmodel.activate(newData, justCreated, {endEditing:()=>{}});
                spyOn(viewmodel.callbacks, 'endEditing');
                viewmodel.endEditing();
                expect(viewmodel.callbacks.endEditing).not.toHaveBeenCalled();
            });
        });

        describe('when current element is editing', ()=>{
            it('should stop editing', ()=>{
                let newData = ko.observable(['newData']);
                let justCreated = true;
                viewmodel.activate(newData, justCreated, {endEditing:()=>{}});
                viewmodel.isEditing
                viewmodel.endEditing();
                expect(viewmodel.isEditing()).toBeFalsy();
            });

            it('should remove focus from every editor instance', ()=>{
                let newData = ko.observable(['newData']);
                let justCreated = true;
                viewmodel.activate(newData, justCreated, {endEditing:()=>{}});
                viewmodel.instances[0].hasFocus = ko.observable(true);
                viewmodel.isEditing=ko.observable(true);
                viewmodel.endEditing();
                expect(viewmodel.instances[0].hasFocus()).toBeFalsy();
            });

            it('should call end editing callback'<()=>{
                let newData = ko.observable(['newData']);
                let justCreated = true;
                viewmodel.activate(newData, justCreated, {endEditing:()=>{}});
                viewmodel.isEditing=ko.observable(true);
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
            let newData = ko.observable(['newData']);
            let justCreated = true;
            viewmodel.isEditing= ko.observable(true);
            let instance = new TextEditor(newData, ()=>{});
            instance.hasFocus = ko.observable(false);
            viewmodel.instances.push(instance);
            viewmodel.startEditing(instance);
            expect(viewmodel.instances[0].hasFocus).toBeTruthy();
        });

    });

});*/
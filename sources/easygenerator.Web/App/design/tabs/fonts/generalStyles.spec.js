import app from 'durandal/app';


import GeneralStyles from './generalStyles';
import { Font, ContentElement} from './generalStyles';

import userContext from 'userContext';

import { fontFamilies } from './../FontsTab';
import bus from 'design/bus';
import eventTracker from 'eventTracker';


let describe = window.describe;
let it = window.it;
let expect = window.expect;
let beforeEach = window.beforeEach;
let spyOn = window.spyOn;

describe('Font element', () => {

    beforeEach(() => {
        spyOn(bus, 'trigger');
        spyOn(app, 'trigger');
        spyOn(eventTracker, 'publish');
    });

    describe('key', ()=>{
    
        it('should be defined', () => {
            let font = new Font({
                key: 'key'
            });
            expect(font.key).toEqual('key');
        });

    });

    describe('fontFamilies', () => {
        
        it('should be defined and should be equal to predefined array', () => {
            let font = new Font({
            });
            expect(font.fontFamilies).toEqual(fontFamilies);
        });
    
    });

    describe('changed', () => {
        
        it('should be function', () => {
            let font = new Font({
            });
            expect(font.changed).toBeFunction();
        });

        it('should call save function', () => {
            let font = new Font({});
            spyOn(font, 'save');
            font.changed();

            expect(font.save).toHaveBeenCalled();
        });
    
    });

    describe('changeMainFontFamily', ()=>{
        
        it('should be function', () => {
            let font = new Font({
            });
            expect(font.changed).toBeFunction();
        });

        it('should change current font family', ()=>{
            
            let font = new Font({
                fontFamily:'oldFF'
            });

            let newFont = {name:'newFontFamily'};
            font.changeMainFontFamily(newFont);
            expect(font.fontFamily()).toEqual('newFontFamily');

        });

        it('should triigger app event', ()=>{
            
            let font = new Font({
                fontFamily:'oldFF'
            });
            let newFont = {name:'newFontFamily'};
            font.changeMainFontFamily(newFont);
            expect(app.trigger).toHaveBeenCalledWith('main-font:changed', 'newFontFamily');

        });
    
    });

    describe('save', ()=>{
        
        it('should be function', () => {
            let font = new Font({});
            expect(font.save).toBeFunction();
        });

        it('should trigger app event', ()=>{
        
            let font = new Font({});
            font.save();
            expect(app.trigger).toHaveBeenCalledWith('font:settings-changed');

        });

        it('should publish event',()=> {

            let font = new Font({});
            font.save();
            expect(eventTracker.publish).toHaveBeenCalledWith("Change general font styles");

        });

    });

});

describe('Content Element',()=>{

    beforeEach(() => {
        spyOn(app, 'trigger');
        spyOn(eventTracker, 'publish');
    });

    describe('isVisible', ()=>{
        
        it('should be observable',()=>{
            
            let contentElement = new ContentElement({key:'someKey'});
            expect(contentElement.isVisible).toBeObservable();

        });

        it('should be false', ()=>{
        
            let contentElement = new ContentElement({key:'someKey'});
            expect(contentElement.isVisible()).toBeFalsy();

        });
    
    });

    describe('key', ()=>{
        
        it('should be defined', ()=>{
        
            let contentElement = new ContentElement({key:'someKey'});
            expect(contentElement.key).toBeDefined();

        });
    
    });
    
    describe('isGeneralSelected', ()=>{
        
        it('should be observable',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.isGeneralSelected).toBeObservable();

        });

        describe('when general font is selected', ()=>{
        
            it('should be true', ()=>{
            
                let contentElement = new ContentElement({isGeneralSelected:true});
                expect(contentElement.isGeneralSelected()).toBeTruthy();

            });

        });

        describe('when general font is not selected', ()=>{
        
            it('should be false', ()=>{
            
                let contentElement = new ContentElement({isGeneralSelected:false});
                expect(contentElement.isGeneralSelected()).toBeFalsy();

            });

        });
    
    });

    describe('generalFontFamily',()=>{
    
        it('should be defined',()=>{
        
            let contentElement = new ContentElement({}, {}, 'generalFontFamily');
            expect(contentElement.generalFontFamily).toBeDefined();

        });

        it('should be equal to main font family',()=>{
        
            let contentElement = new ContentElement({}, {}, 'generalFontFamily');
            expect(contentElement.generalFontFamily).toEqual('generalFontFamily');

        });

    });

    describe('size',()=>{

        it('should be observable',()=>{
        
            let contentElement = new ContentElement({size: '20'});
            expect(contentElement.size).toBeObservable();

        });
    
        describe('when font size is defined',()=>{
            it('should be equal to font size',()=>{
        
                let contentElement = new ContentElement({size: '20'});
                expect(contentElement.size()).toEqual('20');

            });
        
        });

        describe('when font size is not defined',()=>{
            it('should be equal to 14',()=>{
        
                let contentElement = new ContentElement({});
                expect(contentElement.size()).toEqual('14');

            });
        
        });

    });

    describe('originalSize', ()=>{
    
        it('should be defined', ()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.originalSize).toBeDefined();

        });

        it('should be equal to font size',()=>{
        
            let contentElement = new ContentElement({size: '26'});
            expect(contentElement.originalSize).toEqual(contentElement.size());

        });

    });

    describe('color', ()=>{
    
        it('should be observable', ()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.color).toBeObservable();
        
        });

        it('should be defined', ()=>{
        
            let contentElement = new ContentElement({color:'#fff'});
            expect(contentElement.color()).toBeDefined();
            expect(contentElement.color()).toEqual('#fff');

        });

    });

    describe('generalFontColor',()=>{

        it('should be defined and equal generalFontColor', ()=>{

            let contentElement = new ContentElement({},{}, null,'#fff');
            expect(contentElement.generalFontColor).toBeDefined();
            expect(contentElement.generalFontColor).toEqual('#fff');

        });

        describe('when current element is links',()=>{
        
            it('should be equal secondaryFontColor',()=>{
            
                let contentElement = new ContentElement({key:'links'},{}, null,'#fff','#000');
                expect(contentElement.generalFontColor).toBeDefined();
                expect(contentElement.generalFontColor).toEqual('#000');

            });

        });

    });

    describe('isGeneralColorSelected',()=>{
    
        it('should be observable',()=>{

            let contentElement = new ContentElement({});
            expect(contentElement.isGeneralColorSelected).toBeObservable();
        
        });

        describe('when general color is selected',()=>{
            it('should be true',()=>{

                let contentElement = new ContentElement({isGeneralColorSelected:true});
                expect(contentElement.isGeneralColorSelected()).toBeTruthy();
            
            })

        });

        describe('when general color is not selected',()=>{
            
            it('should be false',()=>{

                let contentElement = new ContentElement({isGeneralColorSelected:false});
                expect(contentElement.isGeneralColorSelected()).toBeFalsy();
            
            });

        });
    
    });

    describe('textBackgroundColor', ()=>{
    
        it('should be observable', ()=>{
            
            let contentElement = new ContentElement({});
            expect(contentElement.textBackgroundColor).toBeObservable();

        });

    });

    describe('fontWeight', ()=>{

        it('should be observable', ()=>{
            let contentElement = new ContentElement({});
            expect(contentElement.fontWeight).toBeObservable();
        });

    });

    describe('isBold', ()=>{
    
        it('should be computed', ()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.isBold).toBeComputed();

        });

        describe('when bold text style is selected', ()=>{

            it('should return true',()=>{
            
                let contentElement = new ContentElement({fontWeight:700});
                expect(contentElement.isBold()).toBeTruthy();
            
            });        

        });

        describe('when bold text style is not selected', ()=>{

            it('should return false',()=>{
            
                let contentElement = new ContentElement({fontWeight:400});
                expect(contentElement.isBold()).toBeFalsy();
            
            });        

        });

    });

    describe('fontStyle',()=>{
    
        it('should be observable',()=>{
            
            let contentElement = new ContentElement({});
            expect(contentElement.fontStyle).toBeObservable();
        
        });

        it('should be defined',()=>{
            
            let contentElement = new ContentElement({fontStyle:'italic'});
            expect(contentElement.fontStyle()).toBeDefined();
            expect(contentElement.fontStyle()).toEqual('italic');
        
        });

    });

    describe('isItalic',()=>{
    
        it('should be computed',()=>{
        
            let contentElement = new ContentElement({fontStyle:'italic'});
            expect(contentElement.isItalic).toBeComputed();

        });

        describe('when italic font style is chosen',()=>{
            
            it('should be true',()=>{
            
                let contentElement = new ContentElement({fontStyle:'italic'});
                expect(contentElement.isItalic()).toBeTruthy();

            });
        
        });
    
    });

    describe('textDecoration',()=>{
    
        it('should be observable',()=>{
        
            let contentElement = new ContentElement({textDecoration:'underline'});
            expect(contentElement.textDecoration).toBeObservable();

        });

        it('should be defined',()=>{
            
            let contentElement = new ContentElement({textDecoration:'underline'});
            expect(contentElement.textDecoration()).toBeDefined();
            expect(contentElement.textDecoration()).toEqual('underline');
        
        });
      
    });

    describe('isUnderlined',()=>{
    
        it('should be computed',()=>{
        
            let contentElement = new ContentElement({textDecoration:'underline'});
            expect(contentElement.isUnderlined).toBeComputed();

        });

        describe('when underlined font style is chosen',()=>{
            
            it('should be true',()=>{
            
                let contentElement = new ContentElement({textDecoration:'underline'});
                expect(contentElement.isUnderlined()).toBeTruthy();

            });
        
        });
    
    });

    describe('show',()=>{
    
        it('should be function',()=>{
            
            let contentElement = new ContentElement({});
            expect(contentElement.show).toBeFunction();
            
        });

        describe('when isVisible is false',()=>{
        
            it('should set isVisible true',()=>{
            
                let contentElement = new ContentElement({});
                contentElement.isVisible(false);
                contentElement.show();
                expect(contentElement.isVisible()).toBeTruthy();

            });

        });

        describe('when isVisible is true',()=>{
        
            it('should not change isVisible',()=>{
            
                let contentElement = new ContentElement({});
                contentElement.isVisible(true);
                contentElement.show();
                expect(contentElement.isVisible()).toBeTruthy();

            });

        });

    });

    describe('useGeneral',()=>{
    
        it('should be function',()=>{
            
            let contentElement = new ContentElement({});
            expect(contentElement.useGeneral).toBeFunction();
            
        });

        it('should set isGeneralSelected true',()=>{
        
            let contentElement = new ContentElement({});
            contentElement.useGeneral();

            expect(contentElement.isGeneralSelected()).toBeTruthy();

        });

        it('should set generalFontFamily value to fontFamily',()=>{
        
            let contentElement = new ContentElement({});
            contentElement.generalFontFamily = 'generalFontFamily';
            contentElement.useGeneral();
            expect(contentElement.fontFamily()).toEqual( 'generalFontFamily');

        });

        it('should call save function',()=>{
        
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            contentElement.useGeneral();
            expect(contentElement.save).toHaveBeenCalled();

        });

    });

    describe('generalFontChanged',()=>{
        
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.generalFontChanged).toBeFunction();

        });

        it('should change generalFontFamily property',()=>{
        
            let contentElement = new ContentElement({fontFamily:'old font family'});
            contentElement.generalFontChanged('new Font family');
            expect(contentElement.generalFontFamily).toEqual('new Font family');

        });
        
        describe('when general font is selected',()=>{
        
            it('should change elements font family',()=>{
            
                let contentElement = new ContentElement({fontFamily:'old font family', isGeneralSelected:true});
                contentElement.generalFontChanged('new Font family');
                expect(contentElement.fontFamily()).toEqual('new Font family');

            });
        
        });

        describe('when general font is not selected',()=>{
        
            it('should change elements font family',()=>{
            
                let contentElement = new ContentElement({fontFamily:'old font family', isGeneralSelected:false});
                contentElement.generalFontChanged('new Font family');
                expect(contentElement.fontFamily()).toEqual('old font family');

            });
        
        });

    });

    describe('fontColorChanged',()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.fontColorChanged).toBeFunction();

        });

        it('should update generalFontColor',()=>{
        
            let contentElement = new ContentElement({isGeneralColorSelected: true});
            contentElement.fontColorChanged('#000');
            expect(contentElement.generalFontColor).toEqual('#000');
        
        });

        describe('when general color is selected',()=>{

            it('should change font color',()=>{
            
                let contentElement = new ContentElement({isGeneralColorSelected: true});
                contentElement.fontColorChanged('#000');
                expect(contentElement.color()).toEqual('#000');
            
            });

        });

        describe('when general color is not selected',()=>{

            it('should not change font color',()=>{
            
                let contentElement = new ContentElement({color: '#aaa' ,isGeneralColorSelected: false});
                contentElement.fontColorChanged('#000');
                expect(contentElement.color()).toEqual('#aaa');
            
            });

        });

    });

    describe('selectGeneralColor', ()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.selectGeneralColor).toBeFunction();

        });

        it('should set isGeneralColorSelected true', ()=>{
        
            let contentElement = new ContentElement({});
            contentElement.selectGeneralColor();

            expect(contentElement.isGeneralColorSelected()).toBeTruthy();
        
        });

        it('should change color value', ()=>{
        
            let contentElement = new ContentElement({});
            contentElement.generalFontColor = '#000';
            contentElement.selectGeneralColor();

            expect(contentElement.color()).toEqual('#000');

        });

        it('should call save function',()=>{
        
           
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            contentElement.selectGeneralColor();

            expect(contentElement.save).toHaveBeenCalled();

        });

    });

    describe('selectCustomColor',()=>{

        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.selectCustomColor).toBeFunction();

        });
        
        it('should set isGeneralColorSelected false',()=>{
        
            let contentElement = new ContentElement({});
            contentElement.selectCustomColor();

            expect(contentElement.isGeneralColorSelected()).toBeFalsy();

        });

        it('should call save function',()=>{
        
           
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            contentElement.selectCustomColor();

            expect(contentElement.save).toHaveBeenCalled();

        });
        
    });

    describe('changeFontFamily', ()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.changeFontFamily).toBeFunction();

        });

        it('should change font family',()=>{
        
            let contentElement = new ContentElement({});
            contentElement.changeFontFamily({name:'times'});

            expect(contentElement.fontFamily()).toEqual('times');

        });

        it('should call save function',()=>{
        
           
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            contentElement.changeFontFamily({name:'times'});

            expect(contentElement.save).toHaveBeenCalled();

        });
    
    });

    describe('resetDefaults', ()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.resetDefaults).toBeFunction();

        });

        it('should call save function',()=>{
        
           
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            contentElement.defaults = {};
            contentElement.resetDefaults();

            expect(contentElement.save).toHaveBeenCalled();

        });

    });

    describe('toggleBold',()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.toggleBold).toBeFunction();

        });

        it('should change font weight',()=>{

            let currentFontWeight = 400;
            let contentElement = new ContentElement({fontWeight:currentFontWeight});
            contentElement.toggleBold();
            expect(contentElement.fontWeight()).not.toEqual(currentFontWeight);

        });

        it('should call save function',()=>{
        
           
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            contentElement.toggleBold();

            expect(contentElement.save).toHaveBeenCalled();

        });
    
    });

    describe('toggleItalic',()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.toggleItalic).toBeFunction();

        });

        it('should change font style',()=>{

            let currentFontStyle = 'normal';
            let contentElement = new ContentElement({fontStyle:currentFontStyle});
            contentElement.toggleItalic();
            expect(contentElement.fontStyle()).not.toEqual(currentFontStyle);

        });

        it('should call save function',()=>{
        
           
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            contentElement.toggleItalic();

            expect(contentElement.save).toHaveBeenCalled();

        });
    
    });

    describe('toggleUnderlined',()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.toggleUnderlined).toBeFunction();

        });

        it('should change text decoration',()=>{

            let currentTextDecoration = 'none';
            let contentElement = new ContentElement({fontStyle:currentTextDecoration});
            contentElement.toggleUnderlined();
            expect(contentElement.textDecoration()).not.toEqual(currentTextDecoration);

        });

        it('should call save function',()=>{
        
           
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            contentElement.toggleUnderlined();

            expect(contentElement.save).toHaveBeenCalled();

        });
    
    });

    describe('changeFontSize',()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.save).toBeFunction();;

        });

        it('should change font size', ()=>{
        
            let contentElement = new ContentElement({});
            let currentFontSize = 15;
            contentElement.changeFontSize(20);
            expect(contentElement.size()).not.toEqual(currentFontSize);


        });

        it('should change original font size', ()=>{
        
            let contentElement = new ContentElement({});
            let originalSize = 15;
            contentElement.originalSize = originalSize;
            contentElement.changeFontSize(20);

            expect(contentElement.originalSize).not.toEqual(originalSize);
        
        });

        it('should call save function',()=>{
        
           
            let contentElement = new ContentElement({});
            spyOn(contentElement, 'save');
            let originalSize = 15;
            contentElement.originalSize = originalSize;
            contentElement.changeFontSize(20);

            expect(contentElement.save).toHaveBeenCalled();

        });
    
    });

    describe('stopEditingFontSize',()=>{
    
        it('should be function',()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.stopEditingFontSize).toBeFunction();
        
        });

        describe('when size is not defined or is not a  number',()=>{
        
            it('should make size equal original size',()=>{
            
                let contentElement = new ContentElement({});
                contentElement.originalSize = 14;

                contentElement.size('not_a_number');
                contentElement.stopEditingFontSize();
                expect(contentElement.size()).toEqual(contentElement.originalSize);


            });
        
        });

        describe('when size is number',()=>{
        
            it('should update original size value',()=>{
            
                let contentElement = new ContentElement({});
                let previousOriginalSize = 15;

                contentElement.size(20);
                contentElement.stopEditingFontSize();
                expect(contentElement.originalSize).not.toEqual(previousOriginalSize);
            
            });
            
            it('should call save function',()=>{
            
                let contentElement = new ContentElement({});
                spyOn(contentElement, 'save');
                
                contentElement.size(20);
                contentElement.stopEditingFontSize();
                expect(contentElement.save).toHaveBeenCalled();
            
            });

            describe('and when it is bigger than 72',()=>{
            
                it('should make size equal 72',()=>{
                
                    let contentElement = new ContentElement({});
                    let previousOriginalSize = 15;

                    contentElement.size(1000);
                    contentElement.stopEditingFontSize();
                    expect(contentElement.size()).toEqual(72);
                        
                });

            });

            describe('and when it is lower than 10',()=>{
            
                it('should make size equal 10',()=>{
                
                    let contentElement = new ContentElement({});
                    let previousOriginalSize = 15;

                    contentElement.size(2);
                    contentElement.stopEditingFontSize();
                    expect(contentElement.size()).toEqual(10);
                        
                });

            });

        });

    });

    describe('save', ()=>{
    
        it('should be function', ()=>{
        
            let contentElement = new ContentElement({});
            expect(contentElement.save).toBeFunction();

        });

        it('should publish event with corresponding element name',()=>{
        
            let contentElement = new ContentElement({key:'ololo'});
            contentElement.save();

            expect(eventTracker.publish).toHaveBeenCalledWith(`Change font styles for ololo`);

        });

        it('should trigger app event',()=>{
        
            let contentElement = new ContentElement({key:'ololo'});
            contentElement.save();
            expect(app.trigger).toHaveBeenCalledWith('font:settings-changed');

        });
    
    });

});

describe('General styles design section', () => {
    it('should create general styles fonts section', ()=>{
        
        let generalStyles = new GeneralStyles();
        expect(generalStyles.title).toBeDefined();

    });

    describe('expanded:', () => {

        it('should be observable', () => {
            let generalStyles = new GeneralStyles();
            expect(generalStyles.expanded).toBeObservable();
        });

    });

    describe('colors:', () => {

        it('should be observable', () => {
            let generalStyles = new GeneralStyles();
            expect(generalStyles.colors).toBeObservableArray();
        });

    });

    describe('fontFamilies:', () => {

        it('should be equal to fontfamilies array', () => {
            let generalStyles = new GeneralStyles();
            expect(generalStyles.fontFamilies).toEqual(fontFamilies);
        });

    });

    describe('toggleExpanded:', () => {

        it('should change expanded state', () => {
            let generalStyles = new GeneralStyles();
            generalStyles.expanded(false);

            generalStyles.toggleExpanded();

            expect(generalStyles.expanded()).toBeTruthy();
        });

    });

});
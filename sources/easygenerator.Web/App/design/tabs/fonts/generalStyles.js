import ko from 'knockout';
import app from 'durandal/app';

import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';
import eventTracker from 'eventTracker';

import { Color } from './../branding/interfaceColors/Interface';
import { fontFamilies } from './../FontsTab';

const fontSizes = [10,11,12,14,16,18,20,22,24,26,28,36,48,72];
const fontsTabPalette = 
    [ '#252728', '#404e5c', '#63798e', '#9db2c0', '#073763', '#0b5394', '#3d85c6', '#6fa8dc', '#cccccc', '#d7d7d7', '#f3f3f3', '#ffffff',
            '#000000', '#333333', '#777777', '#999999', '#0c343d', '#134f5c', '#45818e', '#76a5af', '#6fa8dc', '#9fc5e8', '#cfe2f3', '#e7f0f9'
    ];

export default class GeneralStyles {
    constructor() {
        this.available = null;
        this.title =localizationManager.localize('generalStyles');
        this.viewUrl = 'design/tabs/fonts/generalStyles.html';
        this.expanded = ko.observable(true);

        this.colors = ko.observableArray();
        this.mainFont = null;

        this.fontFamilies = fontFamilies;
        this.allowEdit = null;
    }

    activate(settings, defaults, allowEdit) {
        this.available = userContext.hasPlusAccess();
        this.allowEdit = allowEdit;

        let colors = Array.isArray(settings.branding.colors) ? settings.branding.colors : Array.isArray(defaults.branding.colors) ? defaults.branding.colors : [];
        let fonts = Array.isArray(settings.fonts) ? settings.fonts : Array.isArray(defaults.fonts) ? defaults.fonts : [];

        let supportedColors = _.filter(colors, color =>{
            return color.key ==='@text-color' || color.key === '@button-text-color';
        });

        this.colors(_.map(supportedColors, c => new Color(c)));

        let mainFont = _.find(fonts, f => {
            return f.key === 'main-font';
        })

        this.mainFont = mainFont ? new Font(mainFont) : null;
    }

    toggleExpanded() {
        this.expanded(!this.expanded());
    }
}

export class Font{
    constructor(spec){
        this.fontFamilies = fontFamilies;
        this.key = spec.key || 'untitled';
        this.fontFamily = ko.observable(spec.fontFamily || null);
    }

    changed(){
        this.save();
    }

    changeMainFontFamily(font) {
        app.trigger('main-font:changed', font.name);
        this.fontFamily(font.name);
        this.save();
    }
    save(){
        eventTracker.publish('Change general font styles');
        app.trigger('font:settings-changed');
    }
}

export class ContentElement extends Font{
    constructor(spec, defaultSpec, mainFontFamily, generalFontColor, secondaryFontColor){

        super(spec);
        this.isVisible = ko.observable(false);
        this.viewUrl = 'design/tabs/fonts/textStyle.html';
        this.fontSizes = fontSizes;
        this.palette = fontsTabPalette;

        this.key = spec.key;
        this.defaults = defaultSpec || null;

        this.isGeneralSelected = ko.observable(spec.isGeneralSelected);
        this.generalFontFamily = mainFontFamily;

        this.size = ko.observable(spec.size || '14');

        this.originalSize = spec.size || null;

        this.color = ko.observable(spec.color || null);
        this.generalFontColor = generalFontColor;
        if(this.key === 'links'){
            this.generalFontColor = secondaryFontColor;
        }
        this.isGeneralColorSelected = ko.observable(spec.isGeneralColorSelected || null);

        this.textBackgroundColor = ko.observable(spec.textBackgroundColor);

        this.fontWeight = ko.observable(spec.fontWeight || null);

        this.isBold = ko.computed(() => {
            return this.fontWeight() === '700';
        });

        this.fontStyle = ko.observable(spec.fontStyle || null);
        this.isItalic = ko.computed(() => {
            return this.fontStyle() === 'italic';
        });

        this.textDecoration = ko.observable(spec.textDecoration || null);
        this.isUnderlined = ko.computed(() => {
            return this.textDecoration() === 'underline';
        });
        app.on('main-font:changed').then(font => {
            this.generalFontChanged(font);
        });
        app.on('text-color:changed').then(color => {
            if (this.key === 'links') {
                return;
            }
            this.fontColorChanged(color);
        });
    }

    show() {
        if(this.isVisible()) {
            return;
        }
        this.isVisible(!this.isVisible());
    }

    useGeneral(){
        this.isGeneralSelected(true);
        this.fontFamily(this.generalFontFamily);
        this.save();
    }

    generalFontChanged(fontFamily){
        if(this.isGeneralSelected()){
            this.fontFamily(fontFamily);
        }
        this.generalFontFamily = fontFamily;
    }

    fontColorChanged(color){
        this.generalFontColor = color;
        if(this.isGeneralColorSelected()){
            this.color(color);
        }
    }

    selectGeneralColor(){
        this.isGeneralColorSelected(true);
        this.color(this.generalFontColor);
        this.save();
    }

    selectCustomColor(){
        this.isGeneralColorSelected(false);
        this.save();
    }


    changeFontFamily(font) {
        this.isGeneralSelected(false);
        this.fontFamily(font.name);
        this.save();
    }

    resetDefaults(){
        this.size(this.defaults.size);
        this.color(this.generalFontColor);
        this.textBackgroundColor(this.defaults.textBackgroundColor);
        this.fontWeight(this.defaults.fontWeight);
        this.fontStyle(this.defaults.fontStyle);
        this.textDecoration(this.defaults.textDecoration);
        this.isGeneralSelected(true);
        this.fontFamily(this.generalFontFamily ? this.generalFontFamily : this.defaults.fontFamily);
        this.isGeneralColorSelected(true);

        this.save();
    }

    toggleBold(){
        if(this.isBold()){
            this.fontWeight('400');
        }else{
            this.fontWeight('700');
        }
        this.save();
    }

    toggleItalic(){
        if(this.isItalic()){
            this.fontStyle('normal');
        }else{
            this.fontStyle('italic');
        }
        this.save();
    }

    toggleUnderlined(){
        if(this.isUnderlined()){
            this.textDecoration('none');
        }else{
            this.textDecoration('underline');
        }
        this.save();
    }

    changeFontFamily(font) {
        this.isGeneralSelected(false);
        this.fontFamily(font.name);
        this.save();
    }

    changeFontSize(size){
        this.originalSize = size;
        this.size(size);
        return this.save();
    }

    stopEditingFontSize(){
        if(_.isNumber(+this.size()) && !_.isNaN(+this.size())){
            if(+this.size()<10){
                this.size(10);
            }
            if(+this.size()>72){
                this.size(72);
            }
            this.originalSize = this.size();
            this.save();
        }
        else {
            this.size(this.originalSize);
        }
    }


    save(){
        eventTracker.publish(`Change font styles for ${this.key}`);
        app.trigger('font:settings-changed');
    }
}

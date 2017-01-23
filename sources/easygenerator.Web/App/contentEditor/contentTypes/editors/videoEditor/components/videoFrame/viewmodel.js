import binder from 'binder';
import _ from 'underscore';
import constants from 'constants';
import ko from 'knockout';

const defaultSize = {
    width: constants.storage.video.editorVideoFrameSize.width.value,
    height: constants.storage.video.editorVideoFrameSize.height.value
};

export default class {
    constructor(src, width, height) {
        binder.bindClass(this);
        this.viewUrl = 'contentEditor/contentTypes/editors/videoEditor/components/videoFrame/view.html';

        this.width = ko.observable(width || defaultSize.width);
        this.height = ko.observable(height || defaultSize.height);
        this.src = ko.observable(src || constants.storage.video.defaultIframeSource);
    }

    update(src, width, height) {
        this.width(width || defaultSize.width);
        this.height(height || defaultSize.height);
        this.src(src || constants.storage.video.defaultIframeSource);
    }

    toHtml() {
        return `<iframe src="${this.src()}" width="${this.width()}" height="${this.height()}" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
    }

    static getFrameParamsFromHtml(html) {
        let params = {};
        params.src = this._getFrameParamFromHtmlByName('src', html);
        params.width = this._getFrameParamFromHtmlByName('width', html);
        params.height = this._getFrameParamFromHtmlByName('height', html);
        return params;
    }
    
    static _getFrameParamFromHtmlByName(paramName, html) {
        let matches = new RegExp(`${paramName}=["|'](\\S+)["|']`, 'i').exec(html);
        if (_.isNull(matches)) return;

        return matches[1];
    }

    static isFrameValid(html) {
        return /<iframe.*>.*<\/iframe>/.test(html);
    }
}
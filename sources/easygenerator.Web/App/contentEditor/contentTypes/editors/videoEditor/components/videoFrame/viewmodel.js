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

    toHtml() {
        return `<iframe src="${this.src()}" width="${this.width()}" height="${this.height()}"></iframe>`;
    }

    static getFrameParamsFromHtml(html) {
        let params = {};
        params.src = this._getFrameParamFromHtml('src', html);
        params.width = this._getFrameParamFromHtml('width', html);
        params.height = this._getFrameParamFromHtml('height', html);
        return params;
    }
    
    static _getFrameParamFromHtml(paramName, html) {
        let matches = new RegExp(`${paramName}=["|'](\\S+)["|']`, 'i').exec(html);
        if (_.isNull(matches)) return;

        return matches[1]
    }

    static isFrameValid(html) {
        return /<iframe.*>.*<\/iframe>/.test(html);
    }
}
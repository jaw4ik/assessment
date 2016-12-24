import $ from 'jquery';
import _ from 'underscore';
import * as froala from 'froala-editor/js/froala_editor.min';
import modulesLoader from 'modulesLoader';
import jsonReader from 'jsonReader';
import binder from 'binder';

import 'font-awesome/css/font-awesome.min.css!';
import 'froala-editor/css/froala_editor.min.css!';

class FroalaEditor {
    constructor() {
        binder.bindClass(this);
        this.editor = this.initFroalaModule(froala.default).FroalaEditor;
    }

    async setLanguage(lang) {
        if (lang === 'en')
            return;

        let extraLangs = await jsonReader.read(`/app/components/htmlEditor/lang/${lang}.json`);
        let froalaLang = getFroalaLanguageCode(lang);
        await this.loadFroalaModule(`froala-editor/js/languages/${froalaLang}`);

        this.editor.LANGUAGE[froalaLang].translation = $.extend(this.editor.LANGUAGE[froalaLang].translation, extraLangs);
        this.addDefaltOptions({ language: froalaLang });
    }

    addDefaltOptions(options) {
        this.editor.DEFAULTS = $.extend(this.editor.DEFAULTS, options);
    }

    addBlockTag(tag) {
        if (_.some(this.editor.BLOCK_TAGS, item => item === tag))
            return;

        this.editor.BLOCK_TAGS.push(tag);
    }

    setLicense(license) {
        this.editor.DEFAULTS.key  = license;
    }

    async loadFroalaModule(path) {
        let that = this;
        return new Promise((resolve, reject) => {
            modulesLoader.import(path)
                .then(module => {
                    that.initFroalaModule(module);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    }

    initFroalaModule(module) {
        if (_.isFunction(module)) {
            return module(undefined, $);
        }

        return undefined;
    }
}

function getFroalaLanguageCode(lang) {
    return (lang === 'uk' ? 'ua' : lang).replace('-', '_');
}

export default new FroalaEditor();
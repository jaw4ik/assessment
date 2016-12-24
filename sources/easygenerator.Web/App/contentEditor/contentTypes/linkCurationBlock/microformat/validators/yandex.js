import abstractValidator from './abstractValidator.js';
import ko from 'knockout';
import _ from 'underscore';
import apiHttpWrapper from 'http/apiHttpWrapper';
import config from './config.js';

const constants = {
    twitter: {
        title: 'http://dev.twitter.com/cards/markup#title',
        description: 'http://dev.twitter.com/cards/markup#description'
    },
    og: {
        title: 'http://ogp.me/ns#title',
        description: 'http://ogp.me/ns#description',
        image: 'http://ogp.me/ns#image'
    },
    value: '@value',
    type: '@type',
    id: '@id',
    schema: {
        logo: 'http://schema.org/logo'
    }
};

export class yandex extends abstractValidator {
    constructor() {
        super();
    }

    _validateMicroformat(dataSet) { 
        dataSet = JSON.parse(dataSet.data).data;
        let microformat = { images: [], title: '', description: '' };
        try {
            _.each(dataSet.rdfa, (markingNameItem, key) => { 
                if(!_.isUndefined(markingNameItem[constants.type])) {
                    switch(markingNameItem[constants.type][0]) {
                        case "twitter": {
                            if(!_.isUndefined(markingNameItem[constants.twitter.title]))
                                microformat.title = _.isEmpty(markingNameItem[constants.twitter.title][0][constants.value]) ? '' 
                                    : markingNameItem[constants.twitter.title][0][constants.value];
                            if(!_.isUndefined(markingNameItem[constants.twitter.description]))
                                microformat.description = _.isEmpty(markingNameItem[constants.twitter.description][0][constants.value]) ? '' 
                                    : markingNameItem[constants.twitter.description][0][constants.value];
                            break;
                        }
                        case "og": {
                            if(!_.isUndefined(markingNameItem[constants.og.title]))
                                microformat.title = _.isEmpty(markingNameItem[constants.og.title][0][constants.value]) ? '' 
                                        : markingNameItem[constants.og.title][0][constants.value];
                            if(!_.isUndefined(markingNameItem[constants.og.description]))
                                microformat.description = _.isEmpty(markingNameItem[constants.og.description][0][constants.value]) ? '' 
                                    : markingNameItem[constants.og.description][0][constants.value];
                            if(!_.isUndefined(markingNameItem[constants.og.image]))
                                microformat.images.push(_.isEmpty(markingNameItem[constants.og.image][0][constants.value]) ? '' 
                                    : markingNameItem[constants.og.image][0][constants.value]);
                            break;
                        }
                        default: this.response = { status: 800 }; break;
                    }
                }
            });
            _.each(dataSet['json-ld'], (markingNameItem, key) => { 
                if(!_.isUndefined(markingNameItem[constants.schema.logo])) {
                    for (let image in markingNameItem[constants.schema.logo]) {
                        if(!_.isUndefined(markingNameItem[constants.schema.logo][image])) {
                            microformat.images.push(markingNameItem[constants.schema.logo][image][constants.id]); 
                            this.response = { status: 200 };
                        }
                    }
                }
            });     
        } catch (err) {
            return false;
        }
        return microformat;
    };

    async _downloadMicroformat(url) {
        return new Promise((resolve, reject) => {
            let params = '';
            _.each(config.yandex.api.settings, (value, key) => {
                params += key + '=' + value + '&';
            });
            url = config.yandex.api.url + '?' + params + 'url=' + url;
            apiHttpWrapper.get('api/proxyGet', { url: url })
                .then((response) => { 
                    if(response.success) {
                        resolve(response);
                    } else {
                        reject(response); 
                    }
                });
        });
    };

    async parseLink(url) {
        try {
            let microformat = await this._downloadMicroformat(url);
            return this._validateMicroformat(microformat);
        }
        catch (err) {
            return false;
        }
    }

}
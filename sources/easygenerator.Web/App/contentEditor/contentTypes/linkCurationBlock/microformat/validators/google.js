import abstractValidator from './abstractValidator.js';
import ko from 'knockout';
import _ from 'underscore';
import config from './config.js';
import apiHttpWrapper from 'http/apiHttpWrapper';

export class google extends abstractValidator {
    constructor() {
        super();
    }

    _validateMicroformat(dataSet) { 
        let microformat = {};
        try {
            microformat = {};
        } catch (err) {
            return false;
        }
        return microformat;
    };

    async _downloadMicroformat(url) {
        return new Promise((resolve, reject) => {
            url = config.google.api.url + '?url=' + url;
            apiHttpWrapper.post('/api/proxyPost', { url: url })
                .then((response) => { 
                    if(response.success) {
                        debugger;
                        resolve(response);
                    } else {
                        debugger;
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
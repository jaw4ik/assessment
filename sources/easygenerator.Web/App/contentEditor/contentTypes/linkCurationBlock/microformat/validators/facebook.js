import abstractValidator from './abstractValidator.js';
import ko from 'knockout';
import _ from 'underscore';
import config from './config.js';

export class facebook extends abstractValidator {
    constructor() {
        super();
    }

    _validateMicroformat(dataSet) { 
        let microformat = {};
        try {
            microformat.title = _.isEmpty(dataSet.title) ? '' : dataSet.title;
            microformat.description = _.isEmpty(dataSet.description) ? '' : dataSet.description;
            microformat.images = [];
            if(!_.isUndefined(dataSet.image)) {
                for (let index in dataSet.image) {
                    microformat.images.push(dataSet.image[index].url);
                }
            }
        } catch (err) {
            return false;
        }
        return microformat;
    };

    async _downloadMicroformat(url) {
        return new Promise((resolve, reject) => {
            FB.api(
                '/',
                'POST', {
                    'access_token'  : config.facebook.api.access_token,
                    'scrape'        : config.facebook.api.scrape, 
                    'id'            : url 
                },
                function(response) {
                    if(_.isUndefined(response.error)) {
                        resolve(response);
                    } else { 
                        reject(response); 
                    }
                }.bind(this)
            );
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
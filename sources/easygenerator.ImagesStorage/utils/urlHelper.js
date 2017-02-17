'use strict';

class UrlHelper{
    static getImageUrl(req, filename){
        return `//${req.headers.host}/image/${filename}`;
    }
}

module.exports = UrlHelper;
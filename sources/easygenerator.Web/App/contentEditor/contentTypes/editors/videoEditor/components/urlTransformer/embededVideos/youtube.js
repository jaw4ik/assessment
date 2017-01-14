const params = { 
    queryParam: 'v',
    url: 'https://www.youtube.com/embed/{code}'
}

export default class {

    static transform(url) {
        let youtubeSourceId = this._getParameterByName(params.queryParam, url);
        if (!youtubeSourceId) return url;
        return params.url.replace('{code}', youtubeSourceId);
    }    

    static _getParameterByName(param, url) {
        if (!url) return;

        var regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
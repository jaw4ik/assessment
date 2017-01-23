import parse from '../parseUrl';

const params = { 
    url: 'https://player.vimeo.com/video/{code}'
}

export default class {

    static transform(url) {
        let vimeoSourceId = parse(url).pathname;
        return params.url.replace('{code}', vimeoSourceId);
    }
}
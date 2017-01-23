import youtube from './embededVideos/youtube';
import vimeo from './embededVideos/vimeo';
import parse from './parseUrl';

export default class {
    constructor() {
        this.embedVideosTypes = new Map();
        this.embedVideosTypes
            .set('www.youtube.com', youtube)
            .set('vimeo.com', vimeo);
    }

    transform(sourceUrl) {
        let embedVideoType = this.embedVideosTypes.get(parse(sourceUrl).hostname);
        if (!embedVideoType) return sourceUrl;

        return embedVideoType.transform(sourceUrl);
    }
}
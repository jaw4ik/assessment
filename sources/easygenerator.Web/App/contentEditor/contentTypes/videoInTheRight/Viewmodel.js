import ko from 'knockout';
import constants from 'constants';
import ContentTypeBase from './../ContentTypeBaseClass/ContentTypeBase';

export default class extends ContentTypeBase {
    constructor () {
        super();
        this.contentType = constants.contentsTypes.videoInTheRight;
    }
}
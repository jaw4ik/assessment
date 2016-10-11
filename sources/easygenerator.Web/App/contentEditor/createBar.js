import app from 'durandal/app';
import attributesHelper from 'dragAndDrop/helpers/attributesHelper';
import constants from 'constants';

class ContentBar {
    constructor() {
        this.constants = constants;
    }
    createContent(vm, event) {
        var contentType = attributesHelper.getDataAttribute(event.target);
        app.trigger(constants.messages.content.create, contentType);
    }
    done() {
        app.trigger(constants.messages.content.endEditing);
    }
}

export default new ContentBar();
import constants from 'components/htmlEditor/constants';
import EditorHandler from './EditorHandler';
import ko from 'knockout';

class UpdateContentHandler extends EditorHandler {
    constructor($element, data) {
        super($element);
        this.data = data;
    }

    on() {
        let that = this;
        this.$element.on(constants.events.contentChanged, (e, editor) => {
            if(ko.isWriteableObservable(that.data)) {
                let editorValue = editor.html.get();
                let current = that.data();
                if(current !== editorValue) {
                    that.data(editorValue);
                }
            }
        });
    }

    off() {
        this.$element.off(constants.events.contentChanged);
    }
}

export default UpdateContentHandler;
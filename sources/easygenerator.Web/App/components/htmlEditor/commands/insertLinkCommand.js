import froala from '../editorWrapper';

let context = {};

class InsertLinkCommand {
    register() {
        context.callbackBase = froala.editor.COMMANDS.insertLink.callback;
        froala.editor.COMMANDS.insertLink.callback = this.callback;
    }

    callback() {
        context.callbackBase.call(this);
        var $checkbox = this.$tb.find('input.fr-link-attr[type="checkbox"]');
        if ($checkbox.length > 0) {
            $checkbox.prop('checked', true);
        }
    }
}

export default new InsertLinkCommand();
import EditorHandler from './EditorHandler';
import constants from 'components/htmlEditor/constants';

class FocusHandler extends EditorHandler {
    constructor($element, data, isEditing, saveHandler, focusHandler, blurHandler, context, contextArg, autosaveInterval) {
        super($element);
        this.data = data;
        this.isEditing = isEditing;
        this.saveHandler = saveHandler;
        this.focusHandler = focusHandler;
        this.blurHandler = blurHandler;
        this.context = context;
        this.contextArg = contextArg;
        this.autosaveInterval = autosaveInterval;
    }

    on() {
        let that = this;
        this.$element.on(constants.events.editorFocus, () => {
            if (!that.isEditing())
                that.isEditing(true);

            if (!!that.focusHandler)
                that.focusHandler.call(that.context, that.contextArg);

            that.saveIntervalId = setInterval(that.saveData, that.autosaveInterval);
            that.$element.froalaEditor(constants.commands.showToolbar);
        });

        this.$element.on(constants.events.editorBlur, () => {
            that.isEditing(false);
            if (!!that.blurHandler) {
                that.blurHandler.call(that.context, that.contextArg);
            }

            clearInterval(that.saveIntervalId);
            that.$element.froalaEditor(constants.commands.hideToolbar);
        });

        if (this.isEditing()) {
            this.$element.froalaEditor(constants.commands.focus);
        }
    }

    off() {
        clearInterval(this.saveIntervalId);
        this.$element.off(constants.events.editorFocus);
        this.$element.off(constants.events.editorBlur);
    }

    saveData() {
        if (!!this.saveHandler) {
            this.data(this.$element.froalaEditor(constants.commands.getHtml));
            this.saveHandler.call(this.context, this.contextArg);
        }
    }
}

export default FocusHandler;
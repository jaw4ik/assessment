import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import sendFeedbackCommand from 'editor/dialogs/editorFeedback/commands/sendFeedback';

class EditorFeedbackDialog {
    constructor() {
        this.callback = null;
        this.rating = ko.observable(0);
        this.message = {
            isEditing: ko.observable(false),
            text: ko.observable('')
        };
    }

    show(callback) {
        this.callback = callback;
        dialog.show(this, constants.dialogs.editorFeedback.settings);
    }

    submit() {
        sendFeedbackCommand.execute({
            rate: this.rating(),
            message: this.message.text()
        });

        dialog.close();

        if(_.isFunction(this.callback)) {
            this.callback();
        }
    }

    skip(){
        dialog.close();

        if(_.isFunction(this.callback)) {
            this.callback();
        }
    }

    beginEditMessage() {
        this.message.isEditing(true);
    }

    endEditMessage(){
        this.message.isEditing(false);
    }
}

let editorFeedbackDialog = new EditorFeedbackDialog();
export default editorFeedbackDialog;
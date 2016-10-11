import froala from '../editorWrapper';
import froalaConstants from '../constants';

const constants = {
    mark: 'mark'
};

class MarkCommand {
    register() {
        froala.editor.DefineIcon(constants.mark, { NAME: constants.mark });
        froala.editor.RegisterCommand(constants.mark, {
            title: 'Highlighted',
            focus: true,
            undo: true,
            refreshAfterCallback: true,
            callback: function () {
                this.format.toggle(constants.mark);
            },
            refresh: function ($btn) {
                $btn.toggleClass(froalaConstants.classes.active, this.format.is(constants.mark));
            }
        });

        froala.editor.RegisterShortcut(froala.editor.KEYCODE.H, constants.mark, null, 'H', false, false);
    }
}

export default new MarkCommand();
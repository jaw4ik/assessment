import froala from '../editorWrapper';
import froalaConstants from '../constants';

class AlignCommand{
    register() {
        this.registerAlignCommand('align-justify', 'Align Justify', 'justify');
        this.registerAlignCommand('align-right', 'Align Right', 'right');
        this.registerAlignCommand('align-center', 'Align Center', 'center');
        this.registerAlignCommand('align-left', 'Align Left', 'left');
    }

    registerAlignCommand(name, title, align) {
        froala.editor.DefineIcon(name, { NAME: name });
        froala.editor.RegisterCommand(name, {
            title: title,
            focus: true,
            undo: true,
            refreshAfterCallback: true,
            callback: function () {
                this.align.apply(align);
            },
            refresh: function ($btn) {
                let selection = this.selection.blocks();
                if (selection.length) {
                    let currentAlign = this.helpers.getAlignment($(selection[0]));
                    $btn.toggleClass(froalaConstants.classes.active, currentAlign === align);
                }
            }
        });
    }
}

export default new AlignCommand();
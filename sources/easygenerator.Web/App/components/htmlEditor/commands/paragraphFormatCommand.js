import $ from 'jquery';
import froala from '../editorWrapper';

let context = {};

class ParagraphFormatCommand {
    register() {
        context.htmlBase = froala.editor.COMMANDS.paragraphFormat.html;
        context.refreshBase = froala.editor.COMMANDS.paragraphFormat.refresh;

        froala.editor.COMMANDS.paragraphFormat.html = this.html;
        froala.editor.COMMANDS.paragraphFormat.refresh = this.refresh;
    }

    html() {
        let $ul = $(context.htmlBase.call(this));

        $ul.find('a.fr-command').each(function () {
            let $link = $(this);
            $link.html('<span>' + $link.text() + '</span>');
        });

        return $ul[0].outerHTML;
    }

    refresh(arg) {
        context.refreshBase.call(this, arg);
        let node = arg.find('> span');
        node.text(this.language.translate(node.text()));
    }
}

export default new ParagraphFormatCommand();
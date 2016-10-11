import $ from 'jquery';
import _ from 'underscore';
import EditorHandler from './EditorHandler';
import constants from 'components/htmlEditor/constants';

class PasteHtmlHandler extends EditorHandler {
    constructor($element) {
        super($element);
    }

    on() {
        var that = this;
        this.$element.on(constants.events.pasteAfterCleanup, (e, editor, clipboardHtml) => {
            return that.cleanupHtml(clipboardHtml);
        });
    }

    off() {
        this.$element.off(constants.events.pasteAfterCleanup);
    }

    cleanupHtml(html) {
        let cleanHtml = '',
                htmlNodes = $.parseHTML(html);

        _.each(htmlNodes, node => {
            this.cleanupNode(node);
            cleanHtml += node.outerHTML ? node.outerHTML : node.nodeValue;
        });

        return cleanHtml;
    }

    getStylePropertyRegExp(attributeName) {
        return new RegExp('(^| )' + attributeName + '\s*:\s*([^;]*)', 'g');
    }

    cleanupNode(node) {
        if (node.attributes && node.attributes.style) {
            let styleAttr = node.attributes.style;

            let textAlign = styleAttr.value.match(this.getStylePropertyRegExp('text-align'));
            if (textAlign && textAlign.length) {
                styleAttr.value = textAlign[0].trim();
            } else {
                node.removeAttribute('style');
            }
        }

        if (!node.children)
            return;

        _.each(node.childNodes, childNode => {
            this.cleanupNode(childNode);
        });
    }
}

export default PasteHtmlHandler;
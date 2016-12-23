import $ from 'jquery';
import froala from 'components/htmlEditor/editorWrapper';

// plugins
import paragraphFormatPlugin from 'froala-editor/js/plugins/paragraph_format.min';
import linkPlugin from 'froala-editor/js/plugins/link.min';
import listsPlugin from 'froala-editor/js/plugins/lists.min';
import urlPlugin from 'froala-editor/js/plugins/url.min';
import alignPlugin from 'froala-editor/js/plugins/align.min';

// commands
import markCommand from 'components/htmlEditor/commands/markCommand';
import alignCommand from 'components/htmlEditor/commands/alignCommand';
import insertLinkCommand from 'components/htmlEditor/commands/insertLinkCommand';
import paragraphFormatCommand from 'components/htmlEditor/commands/paragraphFormatCommand';

export default {
    execute() {
        froala.setLicense(window.froalaLicenseKey);
        froala.addBlockTag('cite');

        let plugins = [paragraphFormatPlugin, linkPlugin, listsPlugin, urlPlugin, alignPlugin],
            commands = [markCommand, alignCommand, insertLinkCommand, paragraphFormatCommand];

        for(let plugin of plugins) {
            froala.initFroalaModule(plugin);
        }
        for(let command of commands) {
            command.register();
        }
    }
};
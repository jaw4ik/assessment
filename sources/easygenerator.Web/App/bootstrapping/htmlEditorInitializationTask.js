import _ from 'underscore';
import froala from 'components/htmlEditor/editorWrapper';
import markCommand from 'components/htmlEditor/commands/markCommand';
import alignCommand from 'components/htmlEditor/commands/alignCommand';
import insertLinkCommand from 'components/htmlEditor/commands/insertLinkCommand';
import paragraphFormatCommand from 'components/htmlEditor/commands/paragraphFormatCommand';

export default {
    execute() {
        froala.setLicense(window.froalaLicenseKey);
        froala.addBlockTag('cite');

        let plugins = ['paragraph_format', 'link', 'lists', 'url', 'align'],
            commands = [markCommand, alignCommand, insertLinkCommand, paragraphFormatCommand];

        Promise.all(_.map(plugins, froala.addPlugin))
            .then(() => {
                _.each(commands, command => command.register());
            });
    }
};
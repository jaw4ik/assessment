import $ from 'jquery';
import ko from 'knockout';
import _ from 'underscore';
import constants from '../constants';
import options from '../options';
import PasteHtmlHandler from './editorHandlers/PasteHtmlHandler';
import UpdateContentHandler from './editorHandlers/UpdateContentHandler';
import FocusHandler from './editorHandlers/FocusHandler';
import ToolbarPositionHandler from './editorHandlers/ToolbarPositionHandler';

const classes = {
    htmlEditable: 'html-editable',
    styledContent: 'styled-content'
};

ko.bindingHandlers.htmlEditor = {
    init: (element, valueAccessor, bindings, viewModel, bindingContext) => {
        let $element = $(element),
            data = valueAccessor().data,
            scrollableContainer = valueAccessor().scrollableContainer || 'body',
            allBindings = ko.utils.unwrapObservable(bindings());

        let editorHandlers = [
            new PasteHtmlHandler($element),
            new UpdateContentHandler($element, data),
            new ToolbarPositionHandler($element, scrollableContainer, valueAccessor().contentContainer || '.content-section'),
            new FocusHandler($element,
                data,
                valueAccessor().placeholderText,
                valueAccessor().isEditing,
                valueAccessor().save,
                valueAccessor().focus,
                valueAccessor().blur,
                valueAccessor().type || 'default',
                bindingContext.$root,
                viewModel,
                valueAccessor().autosaveInterval || 60000)
        ];

        let defaultPlaceholder = options.basicHtmlEditor.placeholderText;
        options.basicHtmlEditor.placeholderText = valueAccessor().placeholderText || options.basicHtmlEditor.placeholderText;

        $element
            .addClass(classes.htmlEditable)
            .froalaEditor(options.basicHtmlEditor)
            .froalaEditor({ scrollableContainer: scrollableContainer })
            .find(`.${constants.classes.wrapper}`).addClass(classes.styledContent);

        options.basicHtmlEditor.placeholderText = defaultPlaceholder;

        if(allBindings.froalaInstance && ko.isWriteableObservable(allBindings.froalaInstance)) {
            allBindings.froalaInstance($element.data(constants.editor) );
        }

        _.each(editorHandlers, e => e.on());

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {            
            _.each(editorHandlers, e => e.off());

            if( $element.data(constants.editor) ) {
                $element.froalaEditor(constants.commands.destroy);
            }
        });

        _.defer(() => {
            if(!_.isUndefined(viewModel.hasFocus)) {
                if(viewModel.hasFocus()) {
                    var editor = $element.data(constants.editor);
                    editor.events.focus();
                    editor.selection.restore;
                }
            }
        });

        return { controlsDescendantBindings: true };
    }, 
    update: (element, valueAccessor) => {
        let $element = $(element),
           data = ko.utils.unwrapObservable(valueAccessor().data);

        let editorInstance = $element.data(constants.editor);
        if(editorInstance == null) {
            return;
        }

        let editorValue = editorInstance.html.get();
        if( editorValue !== data && (_.isString(data)  || _.isNull(data))) {
            editorInstance.html.set(data);
        }
    }
};


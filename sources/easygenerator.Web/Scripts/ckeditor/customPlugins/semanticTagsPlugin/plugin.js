var tagsGroup = {
    tagsSelectionFormat: ['abbr', 'acronym', 'blockquote', 'q', 'cite', 'dfn', 'code', 'samp', 'em', 'strong', 'sub', 'sup', 'mark', 'time'],
    tagsParagraphFormat: ['address', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'article', 'section', 'aside', 'header', 'footer', 'figure', 'nav'],
    normalTag: 'p, input, span'
};
/* 
    'figcaption',
*/
CKEDITOR.plugins.semanticTagsPlugin = {
    requires: 'richcombo',
    lang: 'en',

    init: function (editor) {
        if (tagsGroup.tagsSelectionFormat.length == 0 && tagsGroup.tagsParagraphFormat.length == 0)
            return;

        var config = editor.config,
            lang = editor.lang.semanticTagsPlugin;

        var elements = {},
            allowedContent = [];

        addTagToElements(tagsGroup.normalTag);

        for (var i = 0; i < tagsGroup.tagsParagraphFormat.length; i++) {
            addTagToElements(tagsGroup.tagsParagraphFormat[i]);
        }

        for (var i = 0; i < tagsGroup.tagsSelectionFormat.length; i++) {
            addTagToElements(tagsGroup.tagsSelectionFormat[i]);
        }

        editor.ui.addRichCombo('semanticTags', {
            label: lang.label,
            title: lang.panelTitle,
            toolbar: 'styles,20',
            allowedContent: allowedContent,
            requiredContent: allowedContent,
            className: 'semantic-dropdown',

            panel: {
                css: [CKEDITOR.skin.getPath('editor')].concat(config.contentsCss),
                multiSelect: false,
                attributes: { 'arial-label': lang.panelTitle }
            },

            init: function () {
                addTagToRichCombo(this, tagsGroup.normalTag);

                this.startGroup(lang.paragraphTitle);
                for (var i = 0; i < tagsGroup.tagsParagraphFormat.length; i++) {
                    addTagToRichCombo(this, tagsGroup.tagsParagraphFormat[i]);
                }

                this.startGroup(lang.selectionTitle);
                for (var i = 0; i < tagsGroup.tagsSelectionFormat.length; i++) {
                    addTagToRichCombo(this, tagsGroup.tagsSelectionFormat[i]);
                }

                function addTagToRichCombo(richCombo, tag) {
                    var label = lang[tag];
                    richCombo.add(tag, label, label);
                }

            },

            onClick: function (value) {
                editor.focus();
                editor.fire('saveSnapshot');
                var element = elements[value];
                if (value == 'hr')
                    editor.insertElement(editor.document.createElement('hr'));
                else
                    element.checkActive(editor.elementPath()) ? editor.removeStyle(element) : editor.applyStyle(element);
                editor.fire('saveSnapshot');
                editor.fire('publishSemanticEvent', value);
            },

            onRender: function () {
                editor.on('selectionChange', function (evt) {
                    var currentTag = this.getValue(),
                        elementPath = evt.data.path;
                    for (var tag in elements) {
                        if (elements[tag].checkActive(elementPath)) {
                            if (tag != currentTag)
                                this.setValue(tag, lang[tag]);
                            return;
                        }
                    }
                    this.setValue('');
                }, this);
            }
        });

        function addTagToElements(tag) {
            var element = new CKEDITOR.style({ element: tag });
            if (!editor.filter.customConfig || editor.filter.check(element)) {
                elements[tag] = element;
                elements[tag]._.enterMode = config.enterMode;
                allowedContent.push(element);
            }
        }
    }
};
CKEDITOR.plugins.add('semanticTagsPlugin', CKEDITOR.plugins.semanticTagsPlugin);
var tagsGroup = {
    tagsSelectionFormat: ['blockquote', 'mark'],
    tagsParagraphFormat: ['h1', 'h2', 'h3'],
    normalTag: 'p'
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

        var styles = {},
            allowedContent = [];

        fillInStyles();
        fillInAllowedContent();

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
                var richCombo = this;
                addItem(tagsGroup.normalTag);

                richCombo.startGroup(lang.paragraphTitle);
                _.each(tagsGroup.tagsParagraphFormat, function (tag) {
                    addItem(tag);
                });

                richCombo.startGroup(lang.selectionTitle);
                _.each(tagsGroup.tagsSelectionFormat, function (tag) {
                    addItem(tag);
                });

                function addItem(tag) {
                    var label = lang[tag];
                    richCombo.add(tag, styles[tag].buildPreview(label), label);
                }
            },

            onClick: function (value) {
                editor.focus();
                editor.fire('saveSnapshot');
                var element = styles[value];
                element.checkActive(editor.elementPath()) ? editor.removeStyle(element) : editor.applyStyle(element);
                editor.fire('saveSnapshot');
                editor.fire('publishSemanticEvent', value);
            },

            onRender: function () {
                editor.on('selectionChange', function (evt) {
                    var currentTag = this.getValue(),
                        elementPath = evt.data.path;
                    for (var tag in styles) {
                        if (styles[tag].checkActive(elementPath)) {
                            if (tag != currentTag)
                                this.setValue(tag, lang[tag]);
                            return;
                        }
                    }
                    this.setValue('');
                }, this);
            }
        });

        function fillInStyles() {
            var tags = _.union([tagsGroup.normalTag], tagsGroup.tagsParagraphFormat, tagsGroup.tagsSelectionFormat);

            _.each(tags, function(tag) {
                var element = new CKEDITOR.style({ element: tag });
                if (!editor.filter.customConfig || editor.filter.check(element)) {
                    styles[tag] = element;
                    styles[tag]._.enterMode = config.enterMode;
                }
            });
        }

        function fillInAllowedContent() {
            for (var tag in styles) {
                allowedContent.push(styles[tag]);
            }
        }
    }
};
CKEDITOR.plugins.add('semanticTagsPlugin', CKEDITOR.plugins.semanticTagsPlugin);
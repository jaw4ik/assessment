(function () {
    var tagsGroup = {
        tagsFormat: ['h1', 'h2', 'h3', 'cite', 'mark'],
        normalTag: 'p'
    };
    /* 
        'figcaption',
    */
    CKEDITOR.plugins.semantictags = {
        requires: 'richcombo',
        lang: 'en,uk,zh-cn,pt-br,de,nl,es',

        init: function (editor) {
            if (tagsGroup.tagsFormat.length == 0)
                return;

            var config = editor.config,
                lang = editor.lang.semantictags;

            var styles = {},
                allowedContent = [];

            fillInStyles();
            fillInAllowedContent();
            addTrackingCommands();

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

                    _.each(tagsGroup.tagsFormat, function (tag) {
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

                    //Execute command
                    editor.execCommand(getCommandNameByTagName(value));
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
                var tags = _.union([tagsGroup.normalTag], tagsGroup.tagsFormat);

                _.each(tags, function (tag) {
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

            function addTrackingCommands() {
                var tags = _.union([tagsGroup.normalTag], tagsGroup.tagsFormat);

                _.each(tags, function (tag) {
                    editor.addTrackingCommand(getCommandNameByTagName(tag), 'Semantic tag \"' + lang[tag] + '\" applied');
                });
            }

            function getCommandNameByTagName(tag) {
                return 'semanticTag' + tag + 'Applied';
            }
        },

        onLoad: function () {
            CKEDITOR.document.appendStyleSheet(this.path + 'styles.css');
        }
    };

    CKEDITOR.plugins.add('semantictags', CKEDITOR.plugins.semantictags);
})();
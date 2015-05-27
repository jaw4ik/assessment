/* 
 Equation Editor Plugin for CKEditor v4
 Version 1.4

 This plugin allows equations to be created and edited from within CKEditor.
 For more information goto: http://www.codecogs.com/latex/integration/ckeditor_v4/install.php
 
 Copyright CodeCogs 2006-2013
 Written by Will Bateman.
 
 Special Thanks to:
  - Kyle Jones for a fix to allow multiple editor to load on one page
*/
(function () {
    window.CCounter = 0;
    var plugin = CKEDITOR.plugins.eqneditor;
    CKEDITOR.dialog.add(plugin.dialogName, function (editor) {
        window.CCounter++;
        var lang = editor.lang.eqneditor,
            dialogDefinition = {
                title: lang.title,
                minWidth: 550,
                minHeight: 380,
                resizable: CKEDITOR.DIALOG_RESIZE_NONE,
                contents: [
                    {
                        id: 'CCEquationEditor',
                        label: 'EqnEditor',
                        elements: [
                            {
                                type: 'html',
                                html: '<div id="CCtoolbar' + window.CCounter + '"></div>',
                                style: 'margin-top:-9px'
                            },
                            {
                                type: 'html',
                                html: '<label for="CClatex' + window.CCounter + '">' + lang.equationTitle + '</label>'
                            },
                            {
                                type: 'html',
                                html: '<textarea id="CClatex' + window.CCounter + '" rows="5"></textarea>',
                                style: 'border:1px solid #8fb6bd; width:540px; font-size:16px; padding:5px; background-color:#ffc'
                            },
                            {
                                type: 'html',
                                html: '<label for="CCequation' + window.CCounter + '">' + lang.preview + '</label>'
                            },
                            {
                                type: 'html',
                                html: '<img id="CCequation' + window.CCounter + '" src="' + plugin.domain + '/images/spacer.gif" />'
                            }
                        ]
                    }
                ],

                getSelectedImage: function () {
                    var sel = editor.getSelection(),
                        image = sel.getStartElement().getAscendant('img', true);
                    return image;
                },

                onLoad: function () {
                    EqEditor.embed('CCtoolbar' + window.CCounter, '', 'efull');
                    EqEditor.add(new EqTextArea('CCequation' + window.CCounter, 'CClatex' + window.CCounter), false);
                },

                onShow: function () {
                    var dialog = this,
                        image = dialogDefinition.getSelectedImage();

                    // has the users selected an equation. Make sure we have the image element, include itself		
                    if (image) {
                        var sName = image.getAttribute('src').match(/(gif|svg)\.latex\?(.*)/);
                        if (sName != null) EqEditor.getTextArea().setText(sName[2]);
                        dialog.insertMode = true;
                    }

                    // set-up the field values based on selected or newly created image
                    dialog.setupContent(image);// TODO: Not needed?
                },

                onOk: function () {
                    var eqn = editor.document.createElement('img');
                    eqn.setAttribute('alt', EqEditor.getTextArea().getLaTeX());
                    eqn.setAttribute('src', EqEditor.getTextArea().exportEquation('urlencoded'));

                    //keep styles of existing image
                    var image = dialogDefinition.getSelectedImage();
                    if (image) {
                        eqn.setAttribute('style', image.getAttribute('style'));
                    }

                    editor.insertElement(eqn);
                    editor.execCommand(plugin.commands.pasteFormula);
                }
            };

        return dialogDefinition;
    });

})();
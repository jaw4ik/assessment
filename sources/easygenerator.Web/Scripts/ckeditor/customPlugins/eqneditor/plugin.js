/* 
 Equation Editor Plugin for CKEditor v4
 Version 2

 This plugin allows equations to be created and edited from within CKEditor.
 For more information goto: http://www.codecogs.com/latex/integration/ckeditor_v4/install.php
 
 Copyright CodeCogs 2006-2013
 Written by Will Bateman.
*/

(function () {
    var plugin = CKEDITOR.plugins.eqneditor = {
        domain: '//latex-staging.easygenerator.com',
        dialogName: 'eqneditorDialog',
        commands: {
            openDialog: 'eqneditorOpenDialog',
            pasteFormula: 'pasteFormula'
        },
        availableLangs: { en: 1, uk: 1 },
        lang: 'en,uk,pt-br,zh-cn,de,nl,es,it',
        requires: ['dialog'],
        icons: "eqneditor",

        init: function (editor) {
            // First make sure we have loaded the necessary scripts
            CKEDITOR.scriptLoader.load([
                plugin.domain + '/js/eq_config.js',
                plugin.domain + '/js/eq_editor-lite-18.js'
            ]);

            // Load Additional CSS 
            var fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", plugin.domain + '/css/equation-embed.css');
            document.getElementsByTagName("head")[0].appendChild(fileref);


            // Add the link and unlink buttons.
            editor.addCommand(plugin.commands.openDialog, new CKEDITOR.dialogCommand(plugin.dialogName,
                {
                    allowedContent: 'img[src,alt,styles]',
                    requiredContent: 'img[src,alt]'
                })
            );

            editor.ui.addButton('EqnEditor', {
                label: editor.lang.eqneditor.toolbar,
                command: plugin.commands.openDialog,
                toolbar: 'insert'
            });

            // add context-menu entry
            if (editor.contextMenu) {
                editor.addMenuGroup(editor.lang.eqneditor.menu);
                editor.addMenuItem('eqneditor', {
                    label: editor.lang.eqneditor.edit,
                    icon: plugin.path + 'icons/eqneditor.png',
                    command: plugin.commands.openDialog,
                    group: editor.lang.eqneditor.menu
                });

                // if the selected item is image of class 'mathImg',
                // we shold be interested in it
                editor.contextMenu.addListener(function (element) {
                    var res = {};
                    if (element.getAscendant('img', true)) {
                        var sName = element.getAttribute('src').match(/(gif|svg)\.latex\?(.*)/);
                        if (sName != null) {
                            res['eqneditor'] = CKEDITOR.TRISTATE_OFF;
                            return res;
                        }
                    }
                });
            }

            editor.on('doubleclick', function (evt) {
                var element = evt.data.element;
                if (element && element.is('img')) {
                    var sName = element.getAttribute('src').match(/(gif|svg)\.latex\?(.*)/);
                    if (sName != null) {
                        evt.data.dialog = plugin.dialogName;
                    }
                }
            }, null, null, 100);

            editor.addTrackingCommand(plugin.commands.openDialog, 'Open formula dialog');
            editor.addTrackingCommand(plugin.commands.pasteFormula, 'Paste formula into the content');
        },
        onLoad: function () {
            CKEDITOR.dialog.add(plugin.dialogName, plugin.path + 'dialogs/eqneditor.js');
        }
    };
    CKEDITOR.plugins.add('eqneditor', CKEDITOR.plugins.eqneditor);
})();


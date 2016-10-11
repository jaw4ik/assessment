export default {
    editor: 'froala.editor',
    events: {
        contentChanged: 'froalaEditor.contentChanged',
        editorBlur: 'froalaEditor.blur',
        editorFocus: 'froalaEditor.focus',
        initialized: 'froalaEditor.initialized',
        keyDown: 'froalaEditor.keydown',
        pasteAfterCleanup: 'froalaEditor.paste.afterCleanup',
        showToolbar: 'froalaEditor.toolbar.show',
        hideToolbar: 'froalaEditor.toolbar.hide'
    },
    commands: {
        destroy: 'destroy',
        showToolbar: 'toolbar.show',
        hideToolbar: 'toolbar.hide',
        focus: 'events.focus',
        getHtml: 'html.get',
        refreshPosition: 'position.refresh'
    },
    classes: {
        active: 'fr-active',
        toolbar: 'fr-toolbar',
        wrapper: 'fr-wrapper'
    }
};
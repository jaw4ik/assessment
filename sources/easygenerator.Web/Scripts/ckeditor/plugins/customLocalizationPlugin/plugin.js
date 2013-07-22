CKEDITOR.plugins.customLocalizationPlugin = {
    lang: 'en,nl,de',
    
    init: function (editor) {
        if (!!editor.config)
            this.extendCustomTags(editor.config, editor.lang.customLocalizationPlugin.customSemanticTags);
        
        if (!!editor.lang.format)
            this.extend(editor.lang.format, editor.lang.customLocalizationPlugin.semanticTags);
    },
    
    extend: function (destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
    },
    
    extendCustomTags: function (destination, source) {
        for (var property in source)
            destination[property].name = source[property];
    }
};

CKEDITOR.plugins.add('customLocalizationPlugin', CKEDITOR.plugins.customLocalizationPlugin);
(function (app) {
    app.cssInjector = {
        applyStyles: function (variables) {
            app.cssInjector.variables = variables;
            $.ajax({ url: 'public/styles/template/cssTemplate.less', cache: false })
                .done(applyStyles);
        },
        variables: null
    }
    
    function applyStyles(cssString) {
        for (var key in app.cssInjector.variables) {
            var regexp = new RegExp(key, 'g');
            cssString = cssString.replace(regexp, app.cssInjector.variables[key]);
        }
        return injectStyles(cssString);
    }

    function injectStyles(cssString){
        var style = $('<style>');
        style.attr('type', 'text/css');
        style.append(cssString);
        style.appendTo('head');
    }

})(window.app);
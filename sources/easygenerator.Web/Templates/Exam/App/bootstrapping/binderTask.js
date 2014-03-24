define(['durandal/binder'], function (binder) {

    var stylesheetLoader = function(container) {
        var $container = $(container);
        var documentHead = document.getElementsByTagName("head")[0];
        $container.find('link').each(function() {
            var url = this.href;
            $(this).remove();
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            documentHead.appendChild(link);
        });
    };


    return {
        execute: function() {
            binder.binding = function (data, view, instruction) {
                stylesheetLoader(view);
            };
        }
    };

});
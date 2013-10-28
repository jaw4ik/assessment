define([], function () {

    var
        url = '',
        activate = function (url) {
            this.url = url;
        }
    ;

    return {
        url: url,
        activate: activate
    };

});
define([], function () {

    var
        url = '',
        activate = function (routeData) {
            this.url = _.isObject(routeData) && _.isString(routeData.url) ? routeData.url : '';
        }
    ;

    return {
        url: url,
        activate: activate
    };

});
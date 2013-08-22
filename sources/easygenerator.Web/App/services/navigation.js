define(function (require) {

    var router = require('plugins/router');

    var
        navigate = function (url) {
            router.navigate(url);
        },
        
        replaceLocation = function (url) {
            router.navigate(url, { replace: true, trigger: false });
        };

    return {
        navigate: navigate,
        replaceLocation: replaceLocation
    };
});
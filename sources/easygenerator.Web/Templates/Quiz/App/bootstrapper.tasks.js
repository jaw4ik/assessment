define(function (require) {
    return {
        getCollection: function () {
            return [
                require('bootstrapping/viewLocatorTask'),
                require('bootstrapping/binderTask')
            ];
        }
    };
})
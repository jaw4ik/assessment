define(function (require) {
    return {
        getCollection: function () {
            return [
                require('bootstrapping/errorHandlingTask'),
                require('bootstrapping/localizationTask'),
                require('bootstrapping/routingTask')
            ];
        }
    };
})
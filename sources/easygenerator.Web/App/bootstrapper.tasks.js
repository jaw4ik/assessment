define(function (require) {
    return {
        getCollection: function () {
            return [
                require('bootstrapping/errorHandlingTask'),
                require('bootstrapping/routingTask'),
                require('bootstrapping/compositionTask'),
                require('bootstrapping/viewLocatorTask'),
                require('bootstrapping/knockoutBindingsTask'),
                require('bootstrapping/addWindowEventsTask'),
                require('bootstrapping/trackVideoUploadTask')
            ];
        }
    };
})
﻿define(function (require) {
    return {
        getCollection: function () {
            return [
                require('bootstrapping/errorHandlingTask'),
                require('bootstrapping/localizationTask'),
                require('bootstrapping/routingTask'),
                require('bootstrapping/compositionTask'),
                require('bootstrapping/viewLocatorTask'),
                require('bootstrapping/knockoutBindingsTask'),
                require('bootstrapping/schedulerTask'),
                require('bootstrapping/synchronizationTask')
            ];
        }
    };
})
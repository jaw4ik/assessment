define([],
    function () {

        "use strict";

        var viewModel = {
            isShown: ko.observable(false),
            
            show: show,
            hide: hide,
            
        };

        return viewModel;

        function show() {
            viewModel.isShown(true);
        }

        function hide() {
            viewModel.isShown(false);
        }
    });
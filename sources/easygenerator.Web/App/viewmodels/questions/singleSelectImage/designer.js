define([],
    function () {
        "use strict";

        var viewModel = {
            activate: activate,
            questionId: '',

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand
        };

        return viewModel;

        function activate(questionId) {
            viewModel.questionId = questionId;
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }
    }
);
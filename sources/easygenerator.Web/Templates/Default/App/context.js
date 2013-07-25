define([],
    function () {
        var self = {};

        self.objectives = [],

        self.initialize = function () {
            return $.ajax({
                url: 'content/data.js?v=' + Math.random(),
                contentType: 'application/json',
                dataType: 'json'
            }).then(function (response) {
                for (var i = 0; i < response.objectives.length; i++) {
                    self.objectives.push(response.objectives[i]);
                }
            });
        };

        return {
            initialize: self.initialize,

            objectives: self.objectives
        };

    });
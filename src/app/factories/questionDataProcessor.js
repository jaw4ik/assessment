(function () {
    "use strict";

    angular.module('assessment')
		.factory('questionDataProcessor', questionDataProcessor);
    
    questionDataProcessor.$inject = ['settings'];

    function questionDataProcessor(settings) {

        var processors = {
            singleSelectText: function (data) { return randomize(data, 'answers'); },
            statement: function (data) { return randomize(data, 'answers'); },
            singleSelectImage: function (data) { return randomize(data, 'answers'); },
            dragAndDropText: function (data) { return randomize(data, 'dropspots'); },
            textMatching: function (data) { return randomize(data, 'answers'); },
            multipleSelect: function (data) { return randomize(data, 'answers'); },
        };

        function randomize(data, property) {
            if (settings.answers.randomize) {
                data[property] = _.shuffle(data[property]);
            }

            return data;
        }

        return {
            process: function (questionData) {
                if(!_.isFunction(processors[questionData.type]))
                    return questionData;

                return processors[questionData.type](questionData);
            }
        };
    }

})();
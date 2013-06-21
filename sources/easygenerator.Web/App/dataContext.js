define(['models/objective'],
    function (objectiveModel) {
        var
            objectives = [],
            initialize = function () {
                return Q.fcall(function () {
                    for (var i = 0; i < 20; i++) {
                        objectives.push({ id: i, title: 'objective #' + i });
                    }
                });
            };

        return {
            initialize: initialize,
            objectives: objectives
        };
    });
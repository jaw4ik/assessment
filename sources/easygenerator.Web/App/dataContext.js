define(['models/objective', 'configuration/images'],
    function (objectiveModel, images) {
        var
            objectives = [],
            initialize = function () {
                return Q.fcall(function () {
                    for (var i = 0; i < 5; i++) {
                        objectives.push({ id: i, title: 'Objective #' + i, image: images[i] });
                    }                    
                });
            };

        return {
            initialize: initialize,
            objectives: objectives
        };
    });
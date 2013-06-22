define(['models/objective', 'configuration/images', 'models/publication'],
    function (objectiveModel, images, publicationModel) {

        var
            objectives = [],
            publications = [],
            initialize = function () {
                return Q.fcall(function () {
                    for (var i = 0; i < 5; i++) {
                        objectives.push({ id: i, title: 'Objective #' + i, image: images[i] });
                    }                    


                    for (var j = 0; j < 5; j++)
                        publications.push(new publicationModel({
                            id: j,
                            title: 'Publication #' + (j + 1),
                            objectives: []
                        }));
                });
            };

        return {
            initialize: initialize,
            objectives: objectives,
            publications: publications
        };
    });
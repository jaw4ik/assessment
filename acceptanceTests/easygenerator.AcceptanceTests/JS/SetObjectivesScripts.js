function Test() {
    var
        dataContext = require('dataContext'),
        images = require('configuration/images'),
        ObjectiveModel = require('models/objective'),
        PubModel = require('models/publication');
    this.AddNewObjective = function (newId, newTitle) {
        dataContext.objectives.push(
            new ObjectiveModel({
                id: newId,
                title: newTitle,
                image: images[0],
                questions: []
            })
        );
    };
    this.AddNewPublication = function (newId, newTitle) {
        dataContext.publications.push(
            new PubModel({
                id: newId,
                title: newTitle,
                objectives: []
            })
        );
    };
    this.EmptyObjectivesList = function () {
        dataContext.objectives = [];
    };
    this.EmptyPublicationsList = function () {
        dataContext.publications = [];
    };
};
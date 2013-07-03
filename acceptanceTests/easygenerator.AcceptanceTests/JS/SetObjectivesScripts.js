
var Test = {
    AddNewObjective: function (newId, newTitle) {
        var
            dataContext = require('dataContext'),
            images = require('configuration/images'),
            ObjectiveModel = require('models/objective');
        dataContext.objectives.push(
            new ObjectiveModel({
                id: newId,
                title: newTitle,
                image: images[0],
                questions: []
            })
        );
    }, EmptyObjectivesList: function () {
        require('dataContext').objectives = [];
    }
};
define(['viewmodels/home', 'durandal/plugins/router'], function (home, router) {
    var objectives = ko.observableArray([]),
        scopes = [],
        activate = function () {
            if (home.objectives.length == 0)
                route.navigateTo('#/');
            objectives([]);
            scope = [];
            objectives(_.map(home.objectives, function (objective) {
                return {
                    id: objective.id,
                    title: objective.title,
                    image: objective.image,
                    scope: 0,
                    count: 0
                };
            }));
            var result = 0;
            _.each(home.itemsQuestion(), function (item) {
                _.each(item.answers, function (answer) {
                    if ((answer.isChecked() && answer.isCorrect) || (!answer.isChecked() && !answer.isCorrect)) {
                        result++;
                    }
                });
                scopes.push({
                    objectiveId: item.objectiveId,
                    value: (result / item.answers.length) * 100
                });
                result = 0;
            });

            _.each(scopes, function (scope) {
                _.each(objectives(), function (objective) {
                    if (scope.objectiveId == objective.id) {
                        objective.scope += scope.value;
                        objective.count++;
                    }
                });
            });
            
            window.scroll(0, 0);

            return _.each(objectives(), function (objective) {
                objective.scope = Math.round(objective.scope / objective.count);
            });
        };

    return {
        activate: activate,
        objectives: objectives
    };
});
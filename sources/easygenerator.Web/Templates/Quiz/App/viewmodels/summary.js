define(['viewmodels/home', 'durandal/plugins/router', 'context'], function (home, router, context) {
    var objectives = ko.observableArray([]),
        scores = [],
        overallScore = ko.observable(0),
        titleOfExperience = ko.observable(''),
        activate = function () {
            if (home.objectives.length == 0)
                return router.navigateTo('#/');
            else {
                objectives([]);
                score = [];
                overallScore(0);
                titleOfExperience('Overall progress on "' + context.title + '"');

                objectives(_.map(home.objectives, function(objective) {
                    return {
                        id: objective.id,
                        title: objective.title,
                        image: objective.image,
                        score: 0,
                        count: 0
                    };
                }));
                var result = 0;

                _.each(home.itemsQuestion(), function(item) {
                    _.each(item.answers, function (answer) {
                        debugger;
                        if ((answer.isChecked() && answer.isCorrect) || (!answer.isChecked() && !answer.isCorrect)) {
                            result++;
                        }
                    });

                    scores.push({
                        objectiveId: item.objectiveId,
                        value: (result / item.answers.length) * 100
                    });
                    result = 0;
                });

                _.each(scores, function(score) {
                    _.each(objectives(), function(objective) {
                        if (score.objectiveId == objective.id) {
                            objective.score += score.value;
                            objective.count++;
                        }
                    });
                    overallScore(overallScore() + score.value);
                });
                
                overallScore(Math.round(overallScore() / scores.length));
                
                window.scroll(0, 0);

                return _.each(objectives(), function(objective) {
                    objective.score = Math.round(objective.score / objective.count);
                });
            }
        };

    return {
        activate: activate,
        objectives: objectives,
        overallScore: overallScore,
        titleOfExperience: titleOfExperience
    };
});
define(['context', 'durandal/plugins/router'], function (context, router) {

    var
        score = null,
        objective = null,
        question = null,
        backToObjectives = function () {
            router.navigateTo('#/');
        },
        showExplanations = function () {
            router.navigateTo('#/objective/' + objective.id + '/question/' + question.id + '/explanations');
        },
        chooseNextQuestion = function () {
            router.navigateTo('#/');
        },
        activate = function (routeData) {
            objective = _.find(context.objectives, function (item) {
                return item.id == routeData.objectiveId;
            });

            question = _.find(objective.questions, function (item) {
                return item.id == routeData.questionId;
            });

            this.score = question.score;
        },
        triggerRedraw = ko.observable(false),
        redrawCanvas = function(cnxt) {
            var progress = this.score / 100;

            cnxt.beginPath();
            cnxt.arc(107, 107, 97, 0, 2 * Math.PI);
            cnxt.strokeStyle = 'rgb(211,212,216)';
            cnxt.lineWidth = 20;
            cnxt.closePath();
            cnxt.stroke();


            if (progress > 0) {
                cnxt.beginPath();
                cnxt.strokeStyle = 'rgb(87,157,193)';
                cnxt.lineWidth = 20;

                if (progress == 1) {
                    cnxt.arc(107, 107, 97, 0, 2 * Math.PI);
                }
                else {
                    cnxt.arc(107, 107, 97, 1.5 * Math.PI, (progress * 2 - 0.5) * Math.PI);
                }

                cnxt.stroke();
            }
            
            cnxt.beginPath();
            cnxt.font = '24pt Arial';
            cnxt.textAlign = 'center';
            cnxt.textBaseline = "middle";
            cnxt.fillStyle = '#666666';
            cnxt.fillText(this.score + "%", 107, 107);
        };

    return {
        score: score,

        backToObjectives: backToObjectives,
        showExplanations: showExplanations,
        chooseNextQuestion: chooseNextQuestion,
        activate: activate,
        triggerRedraw: triggerRedraw,
        redrawCanvas: redrawCanvas
    };
});
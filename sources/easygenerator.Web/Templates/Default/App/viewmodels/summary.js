define(['context', 'durandal/plugins/router'], function (context, router) {
    var objectives = [],
        score = 0,
        activate = function () {

            function getObjectiveScore(objective) {
                var result = _.reduce(objective.questions, function (memo, question) { return memo + question.score; }, 0);
                return Math.round(result / objective.questions.length);
            }

            this.objectives = _.map(context.objectives, function (item) {
                return { title: item.title, score: getObjectiveScore(item) };
            });

            var result = _.reduce(this.objectives, function (memo, objective) { return memo + objective.score; }, 0);
            this.score = Math.round(result / this.objectives.length);
        },
        triggerRedraw = ko.observable(false),
        redrawCanvas = function (cnxt) {
            var progress = this.score / 100;

            cnxt.beginPath();
            cnxt.arc(62, 62, 52, 0, 2 * Math.PI);
            cnxt.strokeStyle = 'rgb(211,212,216)';
            cnxt.lineWidth = 10;
            cnxt.closePath();
            cnxt.stroke();


            if (progress > 0) {
                cnxt.beginPath();
                cnxt.strokeStyle = 'rgb(87,157,193)';
                cnxt.lineWidth = 10;

                if (progress == 1) {
                    cnxt.arc(62, 62, 52, 0, 2 * Math.PI);
                }
                else {
                    cnxt.arc(62, 62, 52, 1.5 * Math.PI, (progress * 2 - 0.5) * Math.PI);
                }

                cnxt.stroke();
            }
        },
        navigateBack = function () {
            router.navigateBack();
        },
        finish = function () {
            window.close();

            if (navigator.appName != "Microsoft Internet Explorer") {
                setTimeout("alert('Thank you. It is now safe to close this page.')", 100);
            }
        };
        

    return {
        activate: activate,
        score: score,
        objectives: objectives,
        triggerRedraw: triggerRedraw,
        redrawCanvas: redrawCanvas,
        navigateBack: navigateBack,
        finish: finish
    };
});
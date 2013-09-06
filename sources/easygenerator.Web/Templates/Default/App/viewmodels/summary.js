define(['context', 'durandal/plugins/router', 'eventsManager'], function (context, router, eventsManager) {
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

        navigateBack = function () {
            router.navigateBack();
        },

        finish = function () {

            eventsManager.fireEvent(eventsManager.eventsList.courseFinished, { result: this.score / 100 }).then(function () {
                eventsManager.fireEvent(eventsManager.eventsList.courseStopped).then(function () {
                    eventsManager.removeAllListeners(); 

                    window.close();

                    if (navigator.appName != "Microsoft Internet Explorer") {
                        setTimeout("alert('Thank you. It is now safe to close this page.')", 100);
                    }
                });
            });

        };


    return {
        activate: activate,
        score: score,
        objectives: objectives,
        navigateBack: navigateBack,
        finish: finish
    };
});
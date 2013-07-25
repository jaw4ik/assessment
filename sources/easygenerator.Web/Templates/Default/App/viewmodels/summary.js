define(['context'], function (context) {

    var
        objectives = [],
        activate = function () {
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            this.objectives = _.map(context.objectives, function (item) {
                return { title: item.title, score: getRandomInt(0, 100) };
            });
        };

    return {
        activate: activate,

        score: 74,
        objectives: objectives
    };
});
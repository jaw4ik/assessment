define(['context'], function (context) {

    var
        objectives = [],
        activate = function () {
            console.log(context.objectives);
            this.objectives = context.objectives;
        };

    return {
        activate: activate,
        caption: 'Objectives and questions',

        objectives: objectives
    };
});
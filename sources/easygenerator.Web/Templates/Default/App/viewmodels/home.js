define(['context'], function (context) {

    var
        objectives = [],
        activate = function () {
            this.objectives = _.map(context.objectives, function (item) {
                return { id: item.id, title: item.title, questions: item.questions, isExpanded: ko.observable(false), toggleExpand: function () { this.isExpanded(!this.isExpanded()); } };
            });
        };

    return {
        activate: activate,
        caption: 'Objectives and questions',

        objectives: objectives
    };
});
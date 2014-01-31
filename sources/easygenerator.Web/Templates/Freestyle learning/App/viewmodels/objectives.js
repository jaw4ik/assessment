define(['context'], function (context) {

    var
        objectives = [],
        activate = function () {
            if (this.objectives.length == 0) {
                this.objectives = _.map(context.objectives, function (item) {
                    return { id: item.id, title: item.title, image: item.image, questions: item.questions, isExpanded: ko.observable(false), toggleExpand: function () { this.isExpanded(!this.isExpanded()); } };
                });
            }
        };

    return {
        activate: activate,
        caption: 'Objectives and questions',

        objectives: objectives
    };
});
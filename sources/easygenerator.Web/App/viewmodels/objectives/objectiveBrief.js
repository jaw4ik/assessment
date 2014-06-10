define([], function () {

    var ObjectiveBriefViewModel = function (item) {

        return {
            id: item.id,
            title: ko.observable(item.title),
            image: item.image,
            questionsCount: item.questionsCount || (item.questions ? item.questions.length : null),
            modifiedOn: ko.observable(item.modifiedOn),
            isSelected: ko.observable(false)
        };

    };

    return ObjectiveBriefViewModel;
});
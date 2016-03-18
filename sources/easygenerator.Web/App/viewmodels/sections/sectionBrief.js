define([], function () {

    return function sectionBriefViewModel(item) {

        return {
            id: item.id,
            title: ko.observable(item.title),
            imageUrl: ko.observable(item.image),
            isImageLoading: ko.observable(false),
            questionsCount: item.questionsCount || (item.questions ? item.questions.length : null),
            modifiedOn: ko.observable(item.modifiedOn),
            isSelected: ko.observable(false),
            createdBy: item.createdBy
        };

    };

});
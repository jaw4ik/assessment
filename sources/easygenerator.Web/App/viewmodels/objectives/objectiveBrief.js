﻿define([], function () {

    var ObjectiveBriefViewModel = function (item) {

        return {
            id: item.id,
            title: item.title,
            image: item.image,
            questionsCount: item.questionsCount || (item.questions ? item.questions.length : null),
            modifiedOn: item.modifiedOn,
            isSelected: ko.observable(false)
        };

    };

    return ObjectiveBriefViewModel;
});
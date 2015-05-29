define(['durandal/app', 'constants'],
    function (app, constants) {
        "use strict";

        return function (course) {

            var viewModel = {
                id: course.id,
                title: ko.observable(course.title),
                modifiedOn: ko.observable(course.modifiedOn),
                thumbnail: ko.observable(course.template.thumbnail),
                currentLanguage: '',
                activate:activate
            };

            return viewModel;

            function activate(currentLanguage) {
                viewModel.currentLanguage = currentLanguage;
            }
        };
    }
);
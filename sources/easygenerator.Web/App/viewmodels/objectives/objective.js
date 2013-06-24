define(['dataContext', 'durandal/plugins/router'],
    function (dataContext, router) {

        var self = {};

        self.id = ko.observable();
        self.title = ko.observable();
        self.image = ko.observable();
        self.questions = ko.observableArray([]);

        self.activate = function (routeData) {

            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == routeData.id;
            });

            if (!_.isObject(objective)) {
                router.navigateTo('404');
            }

            self.id(routeData.id);
            self.title(objective.title);
            self.image(objective.image);
            self.questions(objective.questions);
        };

        self.goBack = function () {
            router.navigateTo('#/');
        };

        return {
            activate: self.activate,
            id: self.id,
            title: self.title,
            image: self.image,
            questions: self.questions,

            goBack: self.goBack
        };
    }
);
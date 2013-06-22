define(['dataContext', 'durandal/plugins/router'],
    function (dataContext, router) {

        var self = {};

        self.title = ko.observable();
        self.image = ko.observable();


        self.activate = function (routeData) {

            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == routeData.id;
            });

            if (!_.isObject(objective)) {
                router.navigateTo('404');
            }

            self.title(objective.title);
            self.image(objective.image);
        };

        self.goBack = function () {
            router.navigateTo('#/');
        };

        return {
            activate: self.activate,
            title: self.title,
            image: self.image,

            goBack: self.goBack
        };
    }
);
define(['dataContext', 'durandal/plugins/router'],
    function (dataContext, router) {

        var self = {};

        self.id = ko.observable();
        self.objectiveId = ko.observable();
        self.title = ko.observable();


        self.activate = function (routeData) {
            if (_.isEmpty(routeData) || _.isEmpty(routeData.objectiveId) || _.isEmpty(routeData.id)) {
                router.navigateTo('400');
                return;
            }

            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == routeData.objectiveId;
            });

            if (!_.isObject(objective)) {
                router.navigateTo('404');
            }

            var question = _.find(objective.questions, function (item) {
                return item.id == routeData.id;
            });


            if (!_.isObject(question)) {
                router.navigateTo('404');
            }

            self.id(routeData.id);
            self.objectiveId(routeData.objectiveId);

            self.title(question.title);

        };

        return {
            id: self.id,
            objectiveId: self.objectiveId,
            title: self.title,

            activate: self.activate
        };
    }
);
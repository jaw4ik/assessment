define(['dataContext', 'models/question', 'durandal/plugins/router'],
    function (dataContext, QuestionModel, router) {
        var self = {};


        self.objective = ko.observable();

        self.title = ko.observable().extend({
            required: { message: 'Please, provide title for question' },
            maxLength: { message: 'Question title can not be lnger than 255 symbols', params: 255 }
        });
        self.title.isModified = ko.observable(false);


        self.save = function () {
            if (!self.title.isValid()) {
                self.title.isModified(true);
                return;
            }


            self.objective().questions.push(new QuestionModel(({ id: self.objective().questions.length, title: self.title() })));
            router.navigateTo('#/objective/' + self.objective().id);
        };

        self.cancel = function () {
            router.navigateBack();
        };

        self.activate = function (routeData) {

            if (_.isEmpty(routeData) || _.isEmpty(routeData.objectiveId)) {
                router.navigateTo('400');
                return;
            }

            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == routeData.objectiveId;
            });

            if (!_.isObject(objective)) {
                router.navigateTo('404');
                return;
            }

            self.title(null);
            self.title.isModified(false);
            self.objective(objective);
        };

        return {
            activate: self.activate,
            title: self.title,
            save: self.save,
            cancel: self.cancel
        };
    }
);
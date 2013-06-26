define(['dataContext', 'models/question', 'durandal/plugins/router'],
    function (dataContext, QuestionModel, router) {
        var self = {};


        self.objective = ko.observable();

        self.title = ko.observable().extend({
            required: { message: 'Please, provide title for question' },
            maxLength: { message: 'Question title can not be lnger than 255 symbols', params: 255 }
        });
        self.title.isModified = ko.observable(false);


        self.text = ko.observable();
        self.answers = ko.observableArray([]);
        self.addAnswer = function () {
            self.answers.push({
                text: ko.observable(),
                isCorrect: ko.observable(true)
            });
        };

        self.save = function () {
            if (!self.title.isValid()) {
                self.title.isModified(true);
                return;
            }

            var question = new QuestionModel(({
                id: self.objective().questions.length,
                title: self.title(),
                answers: ko.utils.arrayMap(self.answers(), function(item) {
                    return { text: ko.utils.unwrapObservable(item.text), isCorrect: ko.utils.unwrapObservable(item.isCorrect) };
                })
            }));

            self.objective().questions.push(question);
            
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
            self.text(null);
            self.answers([]);
        };

        return {
            activate: self.activate,
            title: self.title,
            text: self.text,
            answers: self.answers,
            addAnswer: self.addAnswer,
            save: self.save,
            cancel: self.cancel
        };
    }
);
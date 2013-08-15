define(['durandal/http', 'context', 'durandal/plugins/router'], function (http, context, router) {

    var
        objectiveId = '',
        questionId = '',
        explanations = [],
        
        backToQuestions = function() {
            router.navigateTo('#/');
        },
        
        activate = function (routeData) {
            if (_.isUndefined(routeData.objectiveId) || _.isUndefined(routeData.questionId)
                || _.isNull(routeData.objectiveId) || _.isNull(routeData.questionId)) {
                router.navigateTo('#/400');
                return undefined;
            }
            
            var that = this;
            
            objectiveId = routeData.objectiveId;
            questionId = routeData.questionId;
            
            var objective = _.find(context.objectives, function(item) {
                return item.id == objectiveId;
            });
            
            if (_.isUndefined(objective)) {
                router.navigateTo('#/404');
                return undefined;
            }

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });
            
            if (_.isUndefined(question)) {
                router.navigateTo('#/404');
                return undefined;
            }


            this.explanations = [];
            var requests = [];
            
            _.each(question.explanations, function(item, index) {
                requests.push(http.get('content/' + objectiveId + '/' + questionId + '/' + item.id + '.html').done(function(response) {
                    that.explanations.push({ index: index, explanation: response });
                }));
            });

            window.scroll(0, 0);

            return $.when.apply($, requests).done(function() {
                that.explanations = _.sortBy(that.explanations, function(item) {
                    return item.index;
                });
            });
        },
        
        viewAttached = function () {
            var temp = $('ul.list-group').find('img');
            _.each(temp, function(item) {
                $(item).addClass('img-thumbnail');
            });
        };

    return {
        activate: activate,
        explanations: explanations,
        backToQuestions: backToQuestions,
        viewAttached: viewAttached
    };
});
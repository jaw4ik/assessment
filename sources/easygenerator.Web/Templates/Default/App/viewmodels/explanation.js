define(['durandal/http'], function (http) {

    var
        content = '',
        activate = function (routeData) {
            var objectiveId = routeData.objectiveId;
            var questionId = routeData.questionId;
            var explanationId = routeData.explanationId;

            var that = this;
            return http.get('content/' + objectiveId + '/' + questionId + '/' + explanationId + '.html').then(function(response) {
                that.content = response;
            });
        };

    return {
        activate: activate,

        content: content
    };
});
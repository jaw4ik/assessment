(function () {
    'use strict';

    angular.module('quiz.xApi').factory('xApiDataBuilder', dataBuilder);

    dataBuilder.$inject = ['courseDataBuilder', 'objectiveDataBuilder', 'questionDataBuilder', 'learningContentDataBuilder'];

    function dataBuilder(courseDataBuilder, objectiveDataBuilder, questionDataBuilder, learningContentDataBuilder) {

        /*private fields*/
        var actor = null,
            courseId = '',
            activityName = '',
            activityUrl = '',
            rootUrl = '';
        /*private fields*/

        var builder = {
            init: init,
            courseStarted: courseStarted,
            courseResults: courseResults,
            courseStopped: courseStopped,
            objectiveMastered: objectiveMastered,
            questionAnswered: questionAnswered,
            learningContentExperienced: learningContentExperienced
        };

        return builder;

        function init(id, title, url, agent) {
            courseId = id;
            activityName = title;
            rootUrl = url.split('?')[0].split('#')[0];
            activityUrl = rootUrl + '?course_id=' + id;
            actor = agent;
        }

        function courseStarted() {
            var data = courseDataBuilder.courseStartedData();
            data.object = defaultActivity();
            data.context = defaultContext();
            data.actor = actor;

            return new TinCan.Statement(data);
        }

        function courseResults(course) {
            var data = courseDataBuilder.courseResultData(course);
            data.object = defaultActivity();
            data.context = defaultContext();
            data.actor = actor;

            return new TinCan.Statement(data);
        }

        function courseStopped() {
            var data = courseDataBuilder.courseStoppedData();
            data.object = defaultActivity();
            data.context = defaultContext();
            data.actor = actor;

            return new TinCan.Statement(data);
        }

        function objectiveMastered(objective) {
            var data = objectiveDataBuilder.objectiveMasteredData(objective, rootUrl);
            data.context = defaultContext();
            data.actor = actor;

            return new TinCan.Statement(data);
        }

        function questionAnswered(item) {
            var data = questionDataBuilder.questionAnswered(item, rootUrl);
            data.context = addExtensionsToContext(data.context);
            data.actor = actor;

            return new TinCan.Statement(data);
        }

        function learningContentExperienced(learningContent) {
            var data = learningContentDataBuilder.learningContentExperienced(learningContent);
            data.context = defaultContext();
            data.actor = actor;
        }

        function defaultActivity() {
            var activity = new TinCan.Activity({
                id: activityUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': activityName
                    }
                })
            });
            return activity;
        }

        function defaultContext() {
            var context = new TinCan.Context({
                contextActivities: new TinCan.ContextActivities({})
            });
            context = addExtensionsToContext(context);
            return context;
        }

        function addExtensionsToContext(context) {
            context.extensions = {
                'http://easygenerator/expapi/course/id': courseId
            };
            return context;
        }
    }
}());
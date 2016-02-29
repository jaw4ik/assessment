(function () {
    'use strict';

    angular.module('assessment.xApi').factory('xApiDataBuilder', dataBuilder);

    dataBuilder.$inject = ['courseDataBuilder', 'sectionDataBuilder', 'questionDataBuilder', 'learningContentDataBuilder'];

    function dataBuilder(courseDataBuilder, sectionDataBuilder, questionDataBuilder, learningContentDataBuilder) {
        /*private fields*/
        var actor = null,
            courseId = '',
            activityName = '',
            activityUrl = '',
            rootUrl = '',
            sessionId = '';
        /*private fields*/

        var builder = {
            init: init,
            courseStarted: courseStarted,
            courseResults: courseResults,
            courseStopped: courseStopped,
            sectionMastered: sectionMastered,
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
            sessionId = TinCan.Utils.getUUID();
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

        function sectionMastered(section) {
            var data = sectionDataBuilder.sectionMasteredData(section, rootUrl);
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

        function learningContentExperienced(item) {
            var data = learningContentDataBuilder.learningContentExperienced(item.question, item.time, rootUrl);
            data.context = addExtensionsToContext(data.context);
            data.actor = actor;

            return new TinCan.Statement(data);
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
            context.registration = sessionId;
            return context;
        }
    }
}());

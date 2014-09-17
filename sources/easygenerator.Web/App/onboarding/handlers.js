define(['http/httpWrapper', 'constants', 'durandal/app'], function (httpWrapper, constants, app) {
    "use strict";

    var handlers = {
        courseCreated: courseCreated,
        objectiveCreated: objectiveCreated,
        coursePublished: coursePublished,
        contentCreated: contentCreated,
        createdQuestionsCount: createdQuestionsCount
    };

    return handlers;

    function courseCreated() {
        var tasks = this;
        return httpWrapper.post('api/onboarding/coursecreated').then(function () {
            app.off(constants.messages.onboarding.courseCreated, courseCreated);
            tasks.courseCreated.isCompleted(true);
        });
    }

    function objectiveCreated() {
        var tasks = this;
        return httpWrapper.post('api/onboarding/objectivecreated').then(function () {
            app.off(constants.messages.onboarding.objectiveCreated, objectiveCreated);
            tasks.objectiveCreated.isCompleted(true);
        });
    }

    function contentCreated() {
        var tasks = this;
        return httpWrapper.post('api/onboarding/contentcreated').then(function () {
            app.off(constants.messages.onboarding.contentCreated, contentCreated);
            tasks.contentCreated.isCompleted(true);
        });
    }

    function createdQuestionsCount() {
        var tasks = this;
        return httpWrapper.post('api/onboarding/questioncreated').then(function () {
            tasks.createdQuestionsCount.createdQuestionsCount(tasks.createdQuestionsCount.createdQuestionsCount() + 1);

            if (tasks.createdQuestionsCount.isCompleted()) {
                app.off(constants.messages.onboarding.createdQuestionsCount, createdQuestionsCount);
            }
        });
    }

    function coursePublished() {
        var tasks = this;
        return httpWrapper.post('api/onboarding/coursepublished').then(function () {
            app.off(constants.messages.onboarding.coursePublished, coursePublished);
            tasks.coursePublished.isCompleted(true);
        });
    }

})
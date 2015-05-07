define(['http/apiHttpWrapper', 'constants', 'durandal/app', 'localization/localizationManager'], function (apiHttpWrapper, constants, app, localizationManager) {
    "use strict";

    var tasks = [
        createCourse,
        defineObjective,
        addContent,
        createQuestions,
        publishCourse
    ];

    return tasks;

    function createCourse(states) {
        var task = {
            isCompleted: ko.observable(states.courseCreated),
            title: localizationManager.localize('createCourseOnboardingTaskTitle'),
            description: localizationManager.localize('createCourseOnboardingTaskDescription'),
            handler: function () {
                return apiHttpWrapper.post('api/onboarding/coursecreated').then(function () {
                    app.off(constants.messages.course.created, task.handler);
                    task.isCompleted(true);
                });
            }
        };
        
        if (!task.isCompleted()) {
            app.on(constants.messages.course.created, task.handler);
        }

        return task;
    }

    function defineObjective(states) {
        var task = {
            isCompleted: ko.observable(states.objectiveCreated),
            title: localizationManager.localize('defineObjectiveOnboardingTaskTitle'),
            description: localizationManager.localize('defineObjectiveOnboardingTaskDescription'),
            handler: function () {
                return apiHttpWrapper.post('api/onboarding/objectivecreated').then(function () {
                    app.off(constants.messages.objective.createdInCourse, task.handler);
                    task.isCompleted(true);
                });
            }
        };

        if (!task.isCompleted()) {
            app.on(constants.messages.objective.createdInCourse, task.handler);
        }

        return task;
    }

    function addContent(states) {
        var task = {
            isCompleted: ko.observable(states.contentCreated),
            title: localizationManager.localize('addContentOnboardingTaskTitle'),
            description: localizationManager.localize('addContentOnboardingTaskDescription'),
            handler: function (objectiveId, createdQuestion) {
                if (createdQuestion.type !== constants.questionType.informationContent.type) {
                    return;
                }

                return apiHttpWrapper.post('api/onboarding/contentcreated').then(function () {
                    app.off(constants.messages.question.created, task.handler);
                    task.isCompleted(true);
                });
            }
        };

        if (!task.isCompleted()) {
            app.on(constants.messages.question.created, task.handler);
        }

        return task;
    }

    function createQuestions(states) {
        var
            titleTemplate = localizationManager.localize('createQuestionsOnboardingTaskTitle'),
            questionsCountToComplete = 3,
            getCurrentTitle = function (count) {
                return titleTemplate.replace('{0}', count);
            };

        var task = {
            createdQuestionsCount: ko.observable(states.createdQuestionsCount),
            title: ko.observable(getCurrentTitle(states.createdQuestionsCount)),
            description: localizationManager.localize('createQuestionsOnboardingTaskDescription'),
            handler: function (objectiveId, createdQuestion) {
                if (createdQuestion.type === constants.questionType.informationContent.type) {
                    return;
                }

                return apiHttpWrapper.post('api/onboarding/questioncreated').then(function () {
                    task.createdQuestionsCount(task.createdQuestionsCount() + 1);

                    if (task.isCompleted()) {
                        app.off(constants.messages.question.created, task.handler);
                    }
                });
            }
        };
        task.isCompleted = ko.computed(function () {
            return task.createdQuestionsCount() >= questionsCountToComplete;
        });
        task.createdQuestionsCount.subscribe(function (newValue) {
            if (task.isCompleted()) {
                this.dispose();
            }
            task.title(getCurrentTitle(newValue));
        });

        if (!task.isCompleted()) {
            app.on(constants.messages.question.created, task.handler);
        }

        return task;
    }

    function publishCourse(states) {
        var task = {
            isCompleted: ko.observable(states.coursePublished),
            title: localizationManager.localize('publishOnboardingTaskTitle'),
            description: localizationManager.localize('publishOnboardingTaskDescription'),
            handler: function () {
                return apiHttpWrapper.post('api/onboarding/coursepublished').then(function () {
                    app.off(constants.messages.course.delivering.finished, task.handler);
                    task.isCompleted(true);
                });
            }
        };

        if (!task.isCompleted()) {
            app.on(constants.messages.course.delivering.finished, task.handler);
        }

        return task;
    }

})
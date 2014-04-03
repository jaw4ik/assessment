define(['context', 'repositories/courseRepository', 'plugins/router', 'windowOperations'],
    function (context, repository, router, windowOperations) {

        var
            objectives = [],
            score = 0,
            courseTitle = "\"" + context.course.title + "\"",

            statuses = {
                readyToFinish: 'readyToFinish',
                sendingRequests: 'sendingRequests',
                finished: 'finished'
            },
            status = ko.observable(statuses.readyToFinish),

            activate = function () {
                var course = repository.get();
                if (course == null) {
                    router.navigate('404');
                    return;
                }

                this.score = course.score();
                this.objectives = _.map(course.objectives(), function (item) {
                    return {
                        id: item.id,
                        title: item.title,
                        score: item.score(),
                        image: item.image,
                        questions: item.questions,
                    };
                });
            },

            finish = function () {
                if (status() != statuses.readyToFinish) {
                    return;
                }

                status(statuses.sendingRequests);
                var course = repository.get();
                course.finish(onCourseFinishedCallback);
            },

            onCourseFinishedCallback = function () {
                status(statuses.finished);
                windowOperations.close();
            };

        return {
            activate: activate,
            caption: 'Objectives and questions',
            courseTitle: courseTitle,
            finish: finish,

            score: score,
            objectives: objectives,
            status: status,
            statuses: statuses
        };
    }
);
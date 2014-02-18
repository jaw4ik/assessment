define(['repositories/courseRepository', 'plugins/router', 'windowOperations'],
    function (repository, router, windowOperations) {
        var
            objectives = [],
            score = 0,

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

                course.calculateScore();

                this.score = course.score;
                this.objectives = _.map(course.objectives, function (item) {
                    return { id: item.id, title: item.title, score: item.score };
                });
            },

            navigateBack = function () {
                router.navigateBack();
            },

            finish = function () {
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
            navigateBack: navigateBack,
            finish: finish,

            score: score,
            objectives: objectives,
            status: status,
            statuses: statuses
        };
    });
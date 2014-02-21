define(['durandal/app', 'plugins/router', 'context', 'eventManager', 'windowOperations', 'repositories/courseRepository'],
    function (app, router, context, eventManager, windowOperations, repository) {
        var objectives = [],
            overallScore = 0,

            tryAgain = function () {
                var course = repository.get();
                course.restart();

                this.status(this.statuses.readyToFinish);
                router.navigate('');
            },

            statuses = {
                readyToFinish: 'readyToFinish',
                sendingRequests: 'sendingRequests',
                finished: 'finished'
            },

            status = ko.observable(statuses.readyToFinish),

            finish = function () {
                status(statuses.sendingRequests);

                var course = repository.get();
                course.finish(onCourseFinishedCallback);
            },

            onCourseFinishedCallback = function () {
                status(statuses.finished);
                windowOperations.close();
            };

        activate = function() {
            var course = repository.get();
            if (course == null) {
                router.navigate('404');
                return;
            }

            course.calculateScore();

            this.overallScore = course.score;
            this.objectives = _.map(course.objectives, function (item) {
                return {
                    id: item.id,
                    title: item.title,
                    score: item.score
                };
            });
        },
        canActivate = function() {
            var course = repository.get();
            return course.isAnswered;
        };

        return {
            activate: activate,
            canActivate: canActivate,

            objectives: objectives,
            overallScore: overallScore,
            courseTitle: context.title,
            tryAgain: tryAgain,
            finish: finish,
            status: status,
            statuses: statuses
        };
    }
);
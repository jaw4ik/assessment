define([],
    function () {

        return [
            {
                route: '404',
                moduleId: 'viewmodels/errors/404',
                title: '404 Not Found'
            },
            {
                route: 'objectives',
                moduleId: 'viewmodels/objectives/objectives',
                title: 'Objectives',
                settings: {
                    localizationKey: 'learningObjectives'
                }
            },
            {
                route: 'objective/:objectiveId',
                moduleId: 'viewmodels/objectives/objective',
                title: 'Learning Objective',
                settings: {
                    localizationKey: 'objectiveProperties'
                }
            },
            {
                route: 'objective/:objectiveId/question/:questionId',
                moduleId: 'viewmodels/questions/question',
                title: 'Question',
                settings: {
                    localizationKey: 'questionProperties'
                }
            },
            {
                route: ['', 'courses'],
                moduleId: 'viewmodels/courses/courses',
                title: 'Courses',
                settings: {
                    localizationKey: 'courses'
                }
            },
            {
                route: 'course/:courseId',
                moduleId: 'viewmodels/courses/course',
                title: 'Course',
                settings: {
                    localizationKey: 'course'
                }
            },
            {
                route: 'design/:courseId',
                moduleId: 'viewmodels/courses/design',
                title: 'Design Course',
                settings: {
                    localizationKey: 'course'
                }
            },
            {
                route: 'publish/:courseId',
                moduleId: 'viewmodels/courses/publish',
                title: 'Publish Course',
                settings: {
                    localizationKey: 'course'
                }
            },
            {
                route: 'results/:courseId',
                moduleId: 'viewmodels/courses/results',
                title: 'Results',
                settings: {
                    localizationKey: 'course'
                }
            }
        ];
    }
);
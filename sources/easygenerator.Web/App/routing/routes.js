define([],
    function () {

        return [
            {
                route: '404',
                moduleId: 'viewmodels/errors/404',
                title: '404 Not Found'
            },
            {
                route: 'sections',
                moduleId: 'viewmodels/sections/sections',
                title: 'Sections',
                settings: {
                    localizationKey: 'sections'
                }
            },
            {
                route: 'section/:sectionId',
                moduleId: 'viewmodels/sections/section',
                title: 'Learning Section',
                settings: {
                    localizationKey: 'sectionProperties'
                }
            },
            {
                route: 'section/:sectionId/question/:questionId',
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
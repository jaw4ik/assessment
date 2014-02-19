define([],
    function () {

        return [
            {
                route: '404',
                moduleId: 'viewmodels/errors/404',
                title: '404 Not Found',
            },
            {
                route: '400',
                moduleId: 'viewmodels/errors/400',
                title: '400 Bad Request',
            },
            {
                route: 'user',
                moduleId: 'viewmodels/userproperties',
                title: 'User Properties',
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
                route: 'objective/create',
                moduleId: 'viewmodels/objectives/createObjective',
                title: 'Create learning objective',
                settings: {
                    localizationKey: 'createNewObjective'
                }
            },
            {
                route: 'objective/:id',
                moduleId: 'viewmodels/objectives/objective',
                title: 'Learning Objective',
                settings: {
                    localizationKey: 'objectiveProperties'
                }
            },
            {
                route: 'course/create',
                moduleId: 'viewmodels/courses/createCourse',
                title: 'Create Course',
                settings: {
                    localizationKey: 'createNewCourse'
                }
            },
            {
                route: 'objective/:objectiveId/question/:id',
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
                route: 'course/:id',
                moduleId: 'viewmodels/courses/course',
                title: 'Course',
                settings: {
                    localizationKey: 'course'
                }
            },
            {
                route: 'design/:id',
                moduleId: 'viewmodels/courses/design',
                title: 'Design Course',
                settings: {
                    localizationKey: 'course'
                }
            },
            {
                route: 'deliver/:id',
                moduleId: 'viewmodels/courses/deliver',
                title: 'Deliver Course',
                settings: {
                    localizationKey: 'course'
                }
             },
            {
                route: 'welcome',
                moduleId: 'introduction/welcome',
                title: 'Welcome page',
                settings: {
                    localizationKey: 'introWelcomePageTitle'
                }
            }
        ];
    }
);
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
                title: 'Create New Objective',
            },
            {
                route: 'objective/:id',
                moduleId: 'viewmodels/objectives/objective',
                title: 'Objective Properties',
                settings: {
                    localizationKey: 'objectiveProperties'
                }
            },
            {
                route: 'experience/create',
                moduleId: 'viewmodels/experiences/createExperience',
                title: 'Create New Experience',
                settings: {
                    localizationKey: 'createNewExperience'
                }
            },
            {
                route: 'objective/:objectiveId/question/create',
                moduleId: 'viewmodels/questions/createQuestion',
                title: 'Create New Question',
            },
            {
                route: 'objective/:objectiveId/question/:id',
                moduleId: 'viewmodels/questions/question',
                title: 'Question Properties',
                settings: {
                    localizationKey: 'questionProperties'
                }
            },
            {
                route: ['', 'experiences'],
                moduleId: 'viewmodels/experiences/experiences',
                title: 'Experiences',
                settings: {
                    localizationKey: 'experiences'
                }
            },
            {
                route: 'experience/:id',
                moduleId: 'viewmodels/experiences/experience',
                title: 'Experience',
            }
        ];
    }
);
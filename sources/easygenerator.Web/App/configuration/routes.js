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
                route: 'experience/create',
                moduleId: 'viewmodels/experiences/createExperience',
                title: 'Create Experience',
                settings: {
                    localizationKey: 'createNewExperience'
                }
            },
            {
                route: 'objective/:objectiveId/question/create',
                moduleId: 'viewmodels/questions/createQuestion',
                title: 'Create Question',
                settings: {
                    localizationKey: 'createNewQuestion'
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
                settings: {
                    localizationKey: 'experience'
                }
            }
        ];
    }
);
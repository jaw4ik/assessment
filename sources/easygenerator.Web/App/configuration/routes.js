define(['localization/localizationManager'],
    function (localizationManager) {

        return [
            {
                url: '#/404',
                moduleId: 'viewmodels/errors/404',
                name: '404 Not Found',
                caption: '404 Not Found'
            },
            {
                url: '#/400',
                moduleId: 'viewmodels/errors/400',
                name: '404 Bad Request',
                caption: '404 Bad Request'
            },
            {
                url: '#/user',
                moduleId: 'viewmodels/userproperties',
                name: 'User Properties',
                caption: 'User Properties'
            },
            {
                url: 'objectives',
                moduleId: 'viewmodels/objectives/objectives',
                name: 'Objectives',
                caption: 'Objectives',
                settings: {
                    localizationKey: 'learningObjectives'
                }
            },
            {
                url: 'objective/create',
                moduleId: 'viewmodels/objectives/createObjective',
                name: 'Create New Objective',
                caption: 'Create New Objective'
            },
            {
                url: 'objective/:id',
                moduleId: 'viewmodels/objectives/objective',
                name: 'Objective Properties',
                caption: 'Objective Properties',
                settings: {
                    localizationKey: 'objectiveProperties'
                }
            },
            {
                url: 'experience/create',
                moduleId: 'viewmodels/experiences/createExperience',
                name: 'Create New Experiences',
                caption: 'Create New Experiences'
            },
            {
                url: 'objective/:objectiveId/question/create',
                moduleId: 'viewmodels/questions/createQuestion',
                name: 'Create New Question',
                caption: 'Create New Question'
            },
            {
                url: 'objective/:objectiveId/question/:id',
                moduleId: 'viewmodels/questions/question',
                name: 'Question Properties',
                caption: 'Question Properties',
                settings: {
                    localizationKey: 'questionProperties'
                }
            },
            {
                url: 'experiences',
                moduleId: 'viewmodels/experiences/experiences',
                name: 'Experiences',
                caption: 'Experiences',
                settings: {
                    localizationKey: 'experiences'
                }
            },
            {
                url: 'experience/:id',
                moduleId: 'viewmodels/experiences/experience',
                name: 'Experience',
                caption: 'Experience'
            }
        ];
    }
);
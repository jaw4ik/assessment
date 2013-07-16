﻿define(['localization/localizationManager'],
    function (localizationManager) {

        return [
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
                caption: localizationManager.localize('learningObjectives')
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
                caption: 'Objective Properties'
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
                caption: 'Question Properties'
            },
            {
                url: 'experiences',
                moduleId: 'viewmodels/experiences/experiences',
                name: 'Experiences',
                caption: localizationManager.localize('experiences')
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
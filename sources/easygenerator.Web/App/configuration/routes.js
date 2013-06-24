define([],
    function () {

        return [
            {
                url: 'home',
                moduleId: 'viewmodels/home',
                name: 'Home',
                caption: 'Home'
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
                url: 'publication/create',
                moduleId: 'viewmodels/publications/createPublication',
                name: 'Create New Publication',
                caption: 'Create New Publication'
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
            }
        ];
    }
);
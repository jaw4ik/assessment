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
                url: 'publication/create',
                moduleId: 'viewmodels/publications/createPublication',
                name: 'Create New Publication',
                caption: 'Create New Publication'
            }
        ];
    }
);
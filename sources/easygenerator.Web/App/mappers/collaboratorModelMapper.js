define(['models/collaborator', 'guard'],
    function (CollaboratorModel, guard) {
        "use strict";

        var
            map = function (item) {
                guard.throwIfNotAnObject(item, 'Collaborator is not an object');
                guard.throwIfNotString(item.Email, 'Collaborator email is not a string');
                guard.throwIfNotString(item.FullName, 'Collaborator fullname is not a string');

                return new CollaboratorModel({
                    email: item.Email,
                    fullName: item.FullName
                });
            };

        return {
            map: map
        };
    });
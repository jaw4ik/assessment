define(['models/collaborator'],
    function (CollaboratorModel) {
        "use strict";

        var
            map = function (item) {
                return new CollaboratorModel({
                    id: item.Id,
                    email: item.Email,
                    fullName: item.FullName,
                    createdOn: new Date(item.CreatedOn)
                });
            };

        return {
            map: map
        };
    });
define(['models/collaborator'],
    function (CollaboratorModel) {
        "use strict";

        var
            map = function (item) {
                return new CollaboratorModel({
                    id: item.Id,
                    email: item.Email,
                    registered: item.Registered,
                    fullName: item.FullName,
                    isAccepted: item.IsAccepted,
                    createdOn: new Date(item.CreatedOn)
                });
            };

        return {
            map: map
        };
    });
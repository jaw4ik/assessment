define(['models/audio'],
    function (Audio) {
        "use strict";

        var
            map = function (item) {
                return new Audio({
                    id: item.Id,
                    createdOn: item.CreatedOn,
                    modifiedOn: item.ModifiedOn,
                    title: item.Title,
                    duration: item.Duration,
                    vimeoId: item.VimeoId
                });
            };

        return {
            map: map
        };
    });
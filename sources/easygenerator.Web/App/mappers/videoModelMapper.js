define(['models/video'],
    function (VideoModel) {
        "use strict";

        var map = function (item) {
                return new VideoModel({

                    id: item.Id,
                    createdOn: item.CreatedOn,
                    modifiedOn: item.ModifiedOn,
                    title: item.Title,
                    vimeoId: item.VimeoId

                });
            };

        return {
            map: map
        };
    });
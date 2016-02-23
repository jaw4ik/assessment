define(function () {
    "use strict";

    return {
        map: map
    };

    function map(item) {
        return {
            id: item.Id,
            name: item.Name,
            logoUrl: item.LogoUrl,
            publishCourseApiUrl: item.PublishCourseApiUrl,
            hideDefaultPublishOptions: item.HideDefaultPublishOptions,
            priority: item.Priority,
            createdOn: item.CreatedOn
        };
    };

});
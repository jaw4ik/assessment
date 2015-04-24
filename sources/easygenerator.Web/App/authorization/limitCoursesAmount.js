define(['durandal/app', 'dataContext', 'userContext'], function (app, dataContext, userContext) {
    "use strict";

    var freeLimit = 10;
    var starterLimit = 50;

    var limitCoursesAmount = {
        checkAccess: checkAccess,
        getFreeLimit: getFreeLimit,
        getStarterLimit: getStarterLimit
    };

    return limitCoursesAmount;

    function getFreeLimit() {
        return freeLimit;
    }

    function getStarterLimit() {
        return starterLimit;
    }

    function checkAccess() {
        if (userContext.hasPlusAccess())
            return true;

        var ownedCourses = _.filter(dataContext.courses, function (item) {
            return item.createdBy === userContext.identity.email;
        });

        var limit = userContext.hasStarterAccess() ? starterLimit : freeLimit;
        return ownedCourses.length < limit;
    }
});
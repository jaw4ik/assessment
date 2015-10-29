define(['durandal/app', 'dataContext', 'userContext'], function (app, dataContext, userContext) {
    "use strict";

    var freeLimit = 10,
        starterLimit = 50,
        plusLimit = 100;

    var limitCoursesAmount = {
        checkAccess: checkAccess,
        getCurrentLimit: getCurrentLimit
    };

    return limitCoursesAmount;

    function getCurrentLimit() {
        if (userContext.hasPlusAccess()) {
            return plusLimit;
        }
        if (userContext.hasStarterAccess()) {
            return starterLimit;
        }
        return freeLimit;
    }

    function checkAccess() {
        if (userContext.hasAcademyAccess()) {
            return true;
        }

        var ownedCoursesLength = _.filter(dataContext.courses, function (item) {
            return item.createdBy === userContext.identity.email;
        }).length;

        var limit = 0;

        if (userContext.hasPlusAccess()) {
            limit = plusLimit;
            return ownedCoursesLength < limit;
        }


        limit = userContext.hasStarterAccess() ? starterLimit : freeLimit;
        return ownedCoursesLength < limit;
    }
});
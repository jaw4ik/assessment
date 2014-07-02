define(['constants'], function (constants) {

    "use strict";

    return function (name, firstname, amountOfDays, accessType, expirationDate) {
        this.name = name;
        this.firstname = firstname;
        this.amountOfDays = amountOfDays;

        if (accessType === constants.accessType.starter) {
            this.planName = 'Starter Plan';
        } else if (accessType === constants.accessType.plus) {
            this.planName = 'Plus Plan';
        }

        this.isToday = expirationDate.toDateString() == (new Date()).toDateString();
    };

});
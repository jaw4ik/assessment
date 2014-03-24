define([], function () {

    "use strict";

    return function (name, firstname, amountOfDays, expirationDate) {
        this.name = name;
        this.firstname = firstname;
        this.amountOfDays = amountOfDays;
        this.isToday = expirationDate.toDateString() == (new Date()).toDateString();
    };

});
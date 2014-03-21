define([], function () {

    "use strict";

    return function (name, firstname, amountOfDays) {
        this.name = name;
        this.firstname = firstname;
        this.amountOfDayText = getExpirationDateString(amountOfDays);
        this.amountOfDays = amountOfDays;
    };

    function getExpirationDateString(amountOfDays) {
        switch (amountOfDays) {
            case 0:
                return 'today';
            case 1:
                return amountOfDays + ' day';
            default:
                return amountOfDays + ' days';
        }
    }

});
define([], function () {

    "use strict";

    return function (name, firstname, expirationDate) {

        this.name = name;
        this.firstname = firstname;
        this.expirationDate = expirationDate;

    };
})
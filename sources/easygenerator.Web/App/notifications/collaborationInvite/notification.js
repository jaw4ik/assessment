define([], function () {

    "use strict";

    return function (key, firstname, coauthorFullname, courseTitle) {
        this.key = key;
        this.firstname = firstname;
        this.courseTitle = courseTitle;

        this.coauthorFullname = coauthorFullname;
        this.accept = accept;
        this.decline = decline;
    };

    function accept() {
        alert('accept!');
    }

    function decline() {
        alert('decline!');
    }

});
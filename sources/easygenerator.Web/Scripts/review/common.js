var app = app || {};

$(function () {

    serviceUnavailableAjaxErrorHandler().subscribeOnGlobalErrorEvents();

    if ($('.course-review').length) {
        ko.applyBindings(app.reviewViewModel(), $('.course-review')[0]);
    }
});


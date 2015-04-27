var app = app || {};

app.openHomePage = function () {
    window.location.replace('/');
};

app.reload = function () {
    window.location.reload();
};

app.assingLocation = function (url) {
    window.location.assign(url);
};

app.getLocationHref = function () {
    return window.location.href;
};
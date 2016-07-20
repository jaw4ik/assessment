var app = app || {};

app.openHomePage = function (hash) {
    var url = '/';
    if (hash) {
        hash = hash[0] === '/' ? hash.substring(1) : hash;
        url += hash;
    }
    window.location.replace(url);
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
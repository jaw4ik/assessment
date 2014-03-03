define(['durandal/system', 'durandal/viewEngine'], function (system, viewEngine) {
    return function (data) {
        var dfd = Q.defer();

        $.get(data.model.url + '.html', function (markup) {
            dfd.resolve($("<div>" + markup + "</div>").get(0));
        });

        return dfd.promise;
    };
})
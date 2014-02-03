define(['durandal/system', 'durandal/viewEngine'], function (system, viewEngine) {
    return function (data) {
        var dfd = Q.defer();

        system.acquire(viewEngine.convertViewIdToRequirePath('../../' + data.model.url)).then(function (markup) {
            dfd.resolve($("<div>" + markup + "</div>").get(0));
        });

        return dfd.promise;
    };
})
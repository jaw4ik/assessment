define([], function () {

    return {
        execute: execute
    };

    function execute() {
        var dfd = Q.defer();

        $.post('/ping.ashx')
            .done(function () {
                dfd.resolve(true);
            })
            .fail(function () {
                dfd.reject();
            });

        return dfd.promise;
    };
})
define(function () {

    function read() {
        var defer = Q.defer();
        $.getJSON('settings.js').then(function(json) {
            defer.resolve(json);
        }).fail(function() {
            defer.resolve({});
        });

        return defer.promise;
    }
    
    return {
        read: read
    };
    
});
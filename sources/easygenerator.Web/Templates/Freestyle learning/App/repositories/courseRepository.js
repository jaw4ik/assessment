define(['context'], function (context) {

    return {
        get: get
    };

    function get() {
        return _.isObject(context.course) ? context.course : null;
    }

})
define(['durandal/binder', 'userContext'], function (binder, userContext) {

    return {
        execute: function () {
            binder.binding = function(obj) {
                obj.user = userContext;
            };
        }
    };

})
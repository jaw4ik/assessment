define([], function () {

    return {
        throwIfNotAnObject: function (obj, message) {
            if (!_.isObject(obj)) {
                throw message;
            }
        },
        throwIfNotString: function (str, message) {
            if (!_.isString(str)) {
                throw message;
            }
        },
        throwIfNotBoolean: function(bool, message) {
            if (!_.isBoolean(bool)) {
                throw message;
            }
        }
    };
    
});
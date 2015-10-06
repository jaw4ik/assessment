    var
        set = (key, value) => {

            if (_.isNullOrUndefined(key) ||
                _.isEmpty(key) ||
                _.isUndefined(value)) {
                throw 'Invalid arguments';
            }

            localStorage.setItem(key, JSON.stringify(value));
            return value;
        },

        get = (key) => {

            if (_.isNullOrUndefined(key) ||
                _.isEmpty(key)) {
                throw 'Invalid arguments';
            }

            return JSON.parse(localStorage.getItem(key));
        },

        remove = (key) => {
            if (_.isNullOrUndefined(key) || _.isEmpty(key)) {
                throw 'Invalid arguments';
            }

            localStorage.removeItem(key);
        };

    export default {
        set: set,
        get: get,
        remove: remove
    };
    export var __useDefault = true;

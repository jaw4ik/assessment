var app = app || {};

app.clientSessionContext = {
    set: function (key, value) {

        if (_.isNullOrUndefined(key) ||
            _.isEmpty(key) ||
            _.isUndefined(value)) {
            throw 'Invalid arguments';
        }

        sessionStorage.setItem(key, JSON.stringify(value));
        return value;
    },
    get: function (key) {

        if (_.isNullOrUndefined(key) ||
            _.isEmpty(key)) {
            throw 'Invalid arguments';
        }

        return JSON.parse(sessionStorage.getItem(key));
    },
    remove: function (key) {

        if (_.isNullOrUndefined(key) ||
            _.isEmpty(key)) {
            throw 'Invalid arguments';
        }

        sessionStorage.removeItem(key);
    }
};
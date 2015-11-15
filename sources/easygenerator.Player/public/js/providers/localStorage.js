(function (app) {
    if (!localStorage) {
        app.storageProvider = null;
        return;
    }

    app.storageProvider = {
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        set: function(key, value) {
            if (!key || !value) {
                return;
            }
            localStorage.setItem(key, JSON.stringify(value));
        },
        remove: function(key) {
            localStorage.removeItem(key);
        }
    }

})(window.app);
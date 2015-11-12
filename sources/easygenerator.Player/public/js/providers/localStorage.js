(function (app) {
    if (!localStorage) {
        app.storageProvider = null;
        return;
    }

    app.storageProvider = {
        get: function (key) {
            return localStorage.getItem(key);
        },
        set: function(key, value) {
            if (!key || !value) {
                return;
            }
            localStorage.setItem(key, value);
        },
        remove: function(key) {
            localStorage.removeItem(key);
        }
    }

})(window.app);
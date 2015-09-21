define([], function () {

    function Browse() {
        var that = this;

        that.open = open;

        that.accept = accept;
        that.on = on;
        that.off = off;
        that.dispose = dispose;

        var collection = [];
        var settings = {
            selected: null,
            accept: null
        };

        function open() {
            var input = create();
            input.click();

            collection.push(input);

            return that;
        }

        function accept(value) {
            settings.accept = value;
            return that;
        }

        function on(eventName, callback) {
            if (eventName === 'selected') {
                settings.selected = callback;
            }
            return that;
        }

        function off(eventName) {
            if (eventName === 'selected') {
                settings.selected = null;
            }
            return that;
        }

        function create() {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.style.position = 'absolute';
            input.style.left = '-9999px';
            input.style.top = '-9999px';
            if (settings.accept) {
                input.setAttribute('accept', settings.accept);
            }
            input.addEventListener('change', function (e) {
                if (_.isFunction(settings.selected) && this.files.length) {
                    settings.selected.apply(null, this.files);
                }
            });
            document.body.appendChild(input);

            return input;
        }

        function dispose() {
            _.each(collection, function (input) {
                document.body.removeChild(input);
            });
        }
    }

    return Browse;
});
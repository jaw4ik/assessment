define(['knockout', 'browse'], function (ko, Browse) {

    ko.bindingHandlers.browse = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();

            var browse = new Browse();
            browse.on('selected', value.callback).accept('audio/*');

            $(element).on('click', function () {
                if (_.isFunction(value.before)) {
                    if (value.before()) {
                        browse.open();
                    }
                } else {
                    browse.open();
                }

            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                browse.dispose();
            });
        }
    };

});
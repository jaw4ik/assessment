define(['knockout'], function (ko) {

    ko.bindingHandlers.background = {
        init: function (element) {
            $(element)
                .css('background-position', '0 0')
                .css('background-repeat', 'no-repeat');
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (value) {
                var src = value();
                var image = new Image();
                image.src = src;

                image.onload = function () {
                    $(element)
                        .css('background-image', 'url(' + src + ')')
                        .css('height', image.height)
                        .css('width', image.width);

                    if (_.isFunction(value.backgroundSizeChanged)) {
                        value.backgroundSizeChanged(image.width, image.height);
                    }

                    if (ko.isWriteableObservable(value.width)) {
                        value.width(image.width);
                    }

                    if (ko.isWriteableObservable(value.height)) {
                        value.height(image.height);
                    }
                }
            }
        }
    }

})
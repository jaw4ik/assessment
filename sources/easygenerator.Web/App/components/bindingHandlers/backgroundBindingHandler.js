define(['knockout'], function (ko) {

    ko.bindingHandlers.background = {
        init: function(element) {
            $(element)
                .css('background-position', '0 0')
                .css('background-repeat', 'no-repeat');
        },
        update: function(element, valueAccessor) {
            var value = valueAccessor();
            if (value) {
                var src = value();
                var image = new Image();
                image.onload = function () {

                    $(element).animate({ opacity: 0 }, 200, function() {
                        $(element).css('background-image', 'url(' + src + ')')
                            .css('width', image.width)
                            .animate({ height: image.height }, 200, function () {
                                if (_.isFunction(value.onload)) {
                                    value.onload(image.width, image.height);
                                }
                                $(element).animate({ opacity: 1 }, 300);
                            });
                    });

                    if (ko.isWriteableObservable(value.width)) {
                        value.width(image.width);
                    }

                    if (ko.isWriteableObservable(value.height)) {
                        value.height(image.height);
                    }
                };
                image.src = src;
            }
        }
    };

});
define(['knockout'], function (ko) {

    ko.bindingHandlers.answerImage = {
        init: function () {
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (value) {
                var src = value();
                var image = new Image();
                image.src = src;
                var url = src + '?width=150&height=150&scaleBySmallerSide=true';
                image.onload = function () {
                    $(element).css('background-image', 'url(' + url + ')');
                }
            }
        }
    }

})
define(['knockout'], function (ko) {

    ko.bindingHandlers.answerImage = {
        init: function () {
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            var imageUrl = (value && !_.isNullOrUndefined(value())) ?
                value() + '?width=150&height=150&scaleBySmallerSide=true' :
                '/Content/images/singleSelectImageAnwer.png';

            var image = new Image();
            image.src = imageUrl;
            image.onload = function () {
                $(element).css('background-image', 'url(' + imageUrl + ')');
            }
        }
    }
})
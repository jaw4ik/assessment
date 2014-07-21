﻿define(['knockout'], function (ko) {

    ko.bindingHandlers.answerImage = {
        init: function () {
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var image = ko.unwrap(valueAccessor().answer.image),
                onload = ko.unwrap(valueAccessor().onload),
                isImageUploading = ko.unwrap(valueAccessor().answer.isImageUploading),
                imageUrl = (image && !_.isNullOrUndefined(image)) ?
                    image + '?width=150&height=150&scaleBySmallerSide=true' :
                    '/Content/images/singleSelectImageAnwer.png';

            if (isImageUploading) {
                $(element).css('background-image', 'url(' + '' + ')');
                return;
            }

            var img = new Image();
            img.src = imageUrl;
            img.onload = function () {
                $(element).css('background-image', 'url(' + imageUrl + ')');
                if (onload) {
                    onload.call(this, bindingContext.$data);
                }
            }
        }
    }
})
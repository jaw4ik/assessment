import ko from 'knockout';

ko.bindingHandlers.answerImage = {
    init: function () {
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var image = ko.unwrap(valueAccessor().answer.image),
            onload = ko.unwrap(valueAccessor().onload),
            isImageLoading = ko.unwrap(valueAccessor().answer.isImageLoading),
            imageUrl = (image && !_.isNullOrUndefined(image)) ?
                image + '?width=150&height=150&scaleBySmallerSide=true' :
                '/Content/images/singleSelectImageAnswer.png';

        if (isImageLoading) {
            $(element).css('background-image', 'url(' + '' + ')');
            return;
        }
        var img = new Image();
        img.src = imageUrl;
        img.onload = function () {
            $(element).css('background-image', `url(${imageUrl})`);
            if (onload) {
                onload.call(this, bindingContext.$data);
            }
        }
    }
}

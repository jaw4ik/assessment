import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';

ko.bindingHandlers.coverBackground = {
    update: async (element, valueAccessor) => {
        let src = ko.unwrap(valueAccessor().src),
            width = ko.unwrap(valueAccessor().width),
            height = ko.unwrap(valueAccessor().height);

        if (!src || !src.length) {
            return;
        }

        let thumbnailUrl = src + `?width=${width}&height=${height}&scaleBySmallerSide=true`;
        let imageSize = await getImageSize(thumbnailUrl);

        if (imageSize.width < width && imageSize.height < height) {
            setImageSrc(element, thumbnailUrl);
            return;
        }

        if (imageSize.width >= width && imageSize.height >= height) {
            $(element).css('background-size', 'cover');
            setImageSrc(element, thumbnailUrl);
            return;
        }

        thumbnailUrl = src + `?width=${width}&height=${height}`;
        imageSize = await getImageSize(thumbnailUrl);

        if (imageSize.width >= width && imageSize.height >= height) {
            $(element).css('background-size', 'cover');
        }

        setImageSrc(element, thumbnailUrl);
    }
};

function getImageSize(src) {
    return new Promise(resolve => {
        var image = new Image();
        image.onload = function () {
            resolve({ width: image.width, height: image.height });
        };
        image.src = src;
    });
}

function setImageSrc(element, src) {
    $(element).css({
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-image': 'url(' + src + ')'
    });
}

composition.addBindingHandler('coverBackground');
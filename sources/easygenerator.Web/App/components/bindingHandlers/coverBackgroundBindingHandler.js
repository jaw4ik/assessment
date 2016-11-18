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

        setImageSrc(element, '/Content/images/buildprogress.gif', '24px');

        let thumbnailUrl = src;
        let backgroundSize = 'initial';
        let imageSize = await getImageSize(thumbnailUrl);

        if(imageSize.width >= width || imageSize.height >= height) {
            thumbnailUrl = `${thumbnailUrl}?width=${width}&height=${height}`;
            backgroundSize = 'contain';
        } 
        if(imageSize.width >= width && imageSize.height >= height) {
            thumbnailUrl = `${thumbnailUrl}&scaleBySmallerSide=true`;
            backgroundSize = 'cover';
        }
        setImageSrc(element, thumbnailUrl, backgroundSize);
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

function setImageSrc(element, src, size) {
    $(element).css({
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-image': 'url(' + src + ')',
        'background-size': size
    });
}

composition.addBindingHandler('coverBackground');
﻿import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';

ko.bindingHandlers.coverBackground = {
    update: async (element, valueAccessor) => {
        let src = ko.unwrap(valueAccessor().src),
            width = ko.unwrap(valueAccessor().width),
            height = ko.unwrap(valueAccessor().height);
        
        setImageSrc(element, '/Content/images/buildprogress.gif', '24px');

        if (!src || !src.length) {
            return;
        }

        let thumbnailUrl = src;
        let backgroundSize = 'contain';

        //TODO: when we improve images and save width and height in database it must be uncommented
        /*let imageSize = await getImageSize(thumbnailUrl);

        if(imageSize.width >= width || imageSize.height >= height) {
            thumbnailUrl = `${thumbnailUrl}?width=${width}&height=${height}`;
            backgroundSize = 'contain';
        } 
        if(imageSize.width >= width && imageSize.height >= height) {
            thumbnailUrl = `${thumbnailUrl}&scaleBySmallerSide=true`;
            backgroundSize = 'cover';
        }*/
        thumbnailUrl = `${thumbnailUrl}?width=${width}&height=${height}&scaleBySmallerSide=true`;
        await getImageSize(thumbnailUrl);
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

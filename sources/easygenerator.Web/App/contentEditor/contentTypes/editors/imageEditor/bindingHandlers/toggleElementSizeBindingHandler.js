import ko from 'knockout';
import composition from 'durandal/composition';
import _ from 'underscore';

const allowedDimension = {
    width: 380,
    height: 160
};

var toggleElementClass = ($element, smallHandler, smallHeightHandler, smallWidthHandler) => {
    let dimension = {
        width: $element.width(),
        height: $element.height()
    };

    $element.toggleClass('small-width', dimension.width < allowedDimension.width);
    $element.toggleClass('small-height', dimension.height < allowedDimension.height);
    _.isFunction(smallHandler) && smallHandler(dimension.width < allowedDimension.width && dimension.height < allowedDimension.height);
    _.isFunction(smallWidthHandler) && smallWidthHandler(dimension.width < allowedDimension.width);
    _.isFunction(smallHeightHandler) && smallHeightHandler(dimension.height < allowedDimension.height);
};

ko.bindingHandlers.toggleElementSize = {
    init: (element, valueAccessors) => {
        let $element = $(element),
            smallHandler = valueAccessors().smallHandler,
            smallHeightHandler = valueAccessors().smallHeightHandler,
            smallWidthHandler = valueAccessors().smallWidthHandler;

        $(window).resize(() => {
            _.defer(() => {
                toggleElementClass($element, smallHandler, smallHeightHandler, smallWidthHandler);
            });
        });
    },
    update: (element, valueAccessors) => {
        let $element = $(element),
            isResizeMode = valueAccessors().isResizeMode,
            smallHandler = valueAccessors().smallHandler,
            smallHeightHandler = valueAccessors().smallHeightHandler,
            smallWidthHandler = valueAccessors().smallWidthHandler;

        if (!isResizeMode()) {
            toggleElementClass($element, smallHandler, smallHeightHandler, smallWidthHandler);
        }
    }
};

composition.addBindingHandler('toggleElementSize');
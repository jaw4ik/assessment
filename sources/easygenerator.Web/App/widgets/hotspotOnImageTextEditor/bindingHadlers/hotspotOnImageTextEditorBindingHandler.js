define(function () {
    'use strict';

    var units = 'px';

    var classList = {
        left: 'left',
        right: 'right',
        hotspotOnImageContainer: 'hotspot-on-image-container'
    };

    var containerSelector = '[data-bind*="hotspoteditorcontainer"]';

    return {
        install: install
    };

    function install(parser) {
        ko.bindingHandlers.hotspotOnImageTextEditor = {
            init: function (element, valueAccessor) {
                var $element = $(element),
                    wrapper = valueAccessor().wrapper,
                    points = valueAccessor().points;

                $element.closest(containerSelector).css('position', 'relative');

                var updatePositionHandler = function () { updatePosition($element, wrapper, points, parser); };
                $(window).on('resize', updatePositionHandler);
                var lockMouseDown = function (event) { event.stopPropagation(); };
                $element.on('mousedown', lockMouseDown);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(window).off('resize', updatePositionHandler);
                    $element.off('mousedown', lockMouseDown);
                });
            },
            update: function (element, valueAccessor) {
                var $element = $(element),
                    isVisible = valueAccessor().isVisible,
                    hasFocus = valueAccessor().hasFocus,
                    wrapper = valueAccessor().wrapper,
                    points = valueAccessor().points,
                    close = valueAccessor().close,
                    $html = $('html');

                if (isVisible()) {
                    updatePosition($element, wrapper, points, parser);
                    $element.show();
                    _.defer(function () {
                        hasFocus(true);
                        $html.on('mousedown', close);
                    });
                } else {
                    $element.hide();
                    $html.off('mousedown', close);
                }
            }
        };
    }

    function updatePosition($element, wrapperObservable, pointsObservable, parser) {
        var wrapper = ko.utils.unwrapObservable(wrapperObservable),
            points = ko.utils.unwrapObservable(pointsObservable);

        if (_.isNullOrUndefined(wrapper) || _.isNullOrUndefined(points)) {
            return;
        }

        var minMaxCoords = parser.getMinMaxCoords(points),
            wrapperPositions = $(wrapper).offset(),
            $container = $element.closest(containerSelector),
            $hotspotWrapper = $('.' + classList.hotspotOnImageContainer);

        $element.css('top', getVerticalPosition($container, wrapperPositions, minMaxCoords));
        $element.css('left', getHorizontalPosition($hotspotWrapper, $element, $container, wrapperPositions, minMaxCoords));
    }

    function getVerticalPosition($container, wrapperPositions, minMaxCoords) {
        var topArrowPosition = 28,
            containerTop = $container.offset().top - $container.scrollTop(),
            topPosition = wrapperPositions.top - containerTop,
            spotHeight = minMaxCoords.maxY - minMaxCoords.minY,
            spotCenterPositon = minMaxCoords.minY + spotHeight / 2;
        return topPosition + spotCenterPositon - topArrowPosition + units;
    }

    function getHorizontalPosition($hotspotWrapper, $popover, $container, wrapperPositions, minMaxCoords) {
        var horizontalPosition = 0,
            leftArrowPosition = 7,
            $scrollableContainer = $container.closest('[data-bind*="scrollbar"]'),
            containerLeft = $container.offset().left,
            rightBoundary = $scrollableContainer.length ? $scrollableContainer.outerWidth() - containerLeft : window.innerWidth,
            popoverWidth = $popover.outerWidth() + leftArrowPosition,
            leftPopupPosition = wrapperPositions.left - containerLeft + minMaxCoords.minX - popoverWidth,
            rightPopupPosition = wrapperPositions.left - containerLeft + minMaxCoords.maxX + leftArrowPosition,
            hotSpotRightPosition = wrapperPositions.left - containerLeft + minMaxCoords.maxX,
            hotspotWraperRightPosition = $hotspotWrapper.offset().left - containerLeft + $hotspotWrapper.outerWidth();

        if (hotspotWraperRightPosition < hotSpotRightPosition || rightPopupPosition + popoverWidth > rightBoundary) {
            $popover.removeClass(classList.left).addClass(classList.right);
            horizontalPosition = leftPopupPosition;
        } else {
            $popover.removeClass(classList.right).addClass(classList.left);
            horizontalPosition = rightPopupPosition;
        }

        return horizontalPosition + units;
    }

});
define(function () {
    'use strict';

    var classList = {
        left: 'left',
        right: 'right',
        hotspotOnImageContainer: 'hotspot-on-image-container'
    };

    return {
        install: install
    };

    function install() {
        ko.bindingHandlers.hotspotOnImageTextEditor = {
            init: function (element, valueAccessor) {
                var $element = $(element);
                $element.on('mousedown', function (evt) {
                    evt.stopPropagation();
                });
            },
            update: function (element, valueAccessor) {
                var $element = $(element),
                    isVisible = valueAccessor().isVisible,
                    wrapper = valueAccessor().wrapper(),
                    wrapperPositions = wrapper && wrapper.getBoundingClientRect(),
                    points = valueAccessor().points(),
                    close = valueAccessor().close,
                    minMaxCoords = getMinMaxCoords(points),
                    $hotspotWrapper = $('.' + classList.hotspotOnImageContainer),
                    $html = $('html');

                if (isVisible()) {
                    $element.css('top', getTopPosition(wrapperPositions, minMaxCoords));
                    $element.css('left', getLeftPosion($hotspotWrapper, $element, wrapperPositions, minMaxCoords));
                    $element.show();
                    _.defer(function () {
                        $html.on('mousedown', close);
                    });
                } else {
                    $element.hide();
                    $html.off('mousedown', close);
                }
            }
        };
    }

    function getTopPosition(wrapperPositions, minMaxCoords) {
        var topArrowPosition = 28,
            spotHeight = minMaxCoords.maxY - minMaxCoords.minY,
            scrollYPosition = window.scrollY;
         
        return scrollYPosition + wrapperPositions.top + minMaxCoords.minY + spotHeight / 2 - topArrowPosition + 'px';
    }

    function getLeftPosion($hotspotWrapper, $popover, wrapperPositions, minMaxCoords) {
        var leftArrowPosition = 7,
            spotWidth = minMaxCoords.maxX - minMaxCoords.minX,
            leftPosition = wrapperPositions.left + minMaxCoords.maxX;

        if ($hotspotWrapper.offset().left + $hotspotWrapper.outerWidth() < leftPosition) {
            $popover.removeClass(classList.left);
            $popover.addClass(classList.right);
            return leftPosition - spotWidth - $popover.outerWidth() - leftArrowPosition + 'px';
        }
        $popover.removeClass(classList.right);
        $popover.addClass(classList.left);
        return leftPosition + leftArrowPosition + 'px';
    }

    function getMinMaxCoords(points) {
        var minX = _.min(points, function (point) {
            return point.x;
        }),
            minY = _.min(points, function (point) {
                return point.y;
            }),
            maxX = _.max(points, function (point) {
                return point.x;
            }),
            maxY = _.max(points, function (point) {
                return point.y;
            });

        return {
            minX: minX.x,
            minY: minY.y,
            maxX: maxX.x,
            maxY: maxY.y
        };
    }

});
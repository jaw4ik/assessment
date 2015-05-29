define(function () {
    'use strict';

    var units = 'px';

    var classList = {
        left: 'left',
        right: 'right',
        hotspotOnImageContainer: 'hotspot-on-image-container'
    };

    return {
        install: install
    };

    function install(parser) {
        ko.bindingHandlers.hotspotOnImageTextEditor = {
            init: function (element) {
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
                    minMaxCoords = parser.getMinMaxCoords(points),
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
            scrollYPosition = window.scrollY || window.pageYOffset;
         
        return scrollYPosition + wrapperPositions.top + minMaxCoords.minY + spotHeight / 2 - topArrowPosition + units;
    }

    function getLeftPosion($hotspotWrapper, $popover, wrapperPositions, minMaxCoords) {
        var leftArrowPosition = 7,
            spotWidth = minMaxCoords.maxX - minMaxCoords.minX,
            leftPosition = wrapperPositions.left + minMaxCoords.maxX,
            htspotWraperRightPosition = $hotspotWrapper.offset().left + $hotspotWrapper.outerWidth(),
            currentLeftPosition = 0;

        if (htspotWraperRightPosition < leftPosition
            || htspotWraperRightPosition + $popover.width() > window.innerWidth) {
            $popover.removeClass(classList.left).addClass(classList.right);
            currentLeftPosition = leftPosition - spotWidth - $popover.outerWidth() - leftArrowPosition;
        }

        if (currentLeftPosition <= 0) {
            $popover.removeClass(classList.right).addClass(classList.left);
            return leftPosition + leftArrowPosition + units;
        } else {
            return currentLeftPosition + units;
        }
    }

});
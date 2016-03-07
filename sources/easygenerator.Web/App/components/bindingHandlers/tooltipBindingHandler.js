define(['durandal/app', 'durandal/composition', 'constants', 'components/tooltip/view.html!text'], function (app, composition, constants, view) {
    "use strict";

    return {
        install: install
    };

    function install() {
        var containerSelector = '[data-bind*="tooltipcontainer"]';
        var animationDuration = 200;
        var tooltipHolderClass = 'tooltip-holder';

        app.on(constants.messages.treeOfContent.expanded, closeAllTooltips);
        app.on(constants.messages.treeOfContent.collapsed, closeAllTooltips);

        ko.bindingHandlers.tooltip = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                ko.applyBindingsToDescendants(bindingContext, element);

                initTooltip(element, valueAccessor() || 'top');
                return { controlsDescendantBindings: true };
            },
            update: function (element, valueAccessor) {

            }
        };

        function closeAllTooltips() {
            $('.' + tooltipHolderClass).finish().fadeOut(animationDuration);
        }

        function initTooltip(element, preferredVerticalAligment) {
            var $element = $(element);
            var elementContent = $element.html();
            $element.empty();

            var $tooltip = addTooltip(elementContent);

            function addTooltip(elementContent) {
                var $tooltip = $('<div/>', { 'class': tooltipHolderClass });

                $element.closest(containerSelector).append($tooltip);
                ko.utils.setHtml($tooltip, view);

                $('.tooltip-content-holder', $tooltip).html(elementContent);

                $('.tooltip-close-button', $tooltip).click(closeHandler);

                return $tooltip;
            }
            
            $(window).on('keypress', closeOnEscHandler);
            $(window).on('resize', closeHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $tooltip.remove();
                $(window).off('keypress', closeOnEscHandler);
                $(window).off('resize', closeHandler);
            });

            function closeOnEscHandler(e) {
                if (e.keyCode == 27) {
                    hide($tooltip);
                }
            }

            function closeHandler() {
                hide($tooltip);
            }

            function hide($container) {
                $container.finish().fadeOut(animationDuration);
            }

            $element.click(function () {
                if (!$tooltip.is(':visible')) {
                    var $container = $(element).closest(containerSelector);
                    var position = getPosition(preferredVerticalAligment, $element, $container, $tooltip);

                    var resultStyles = {
                        opacity: '1',
                        top: position.vertical.top + 'px'
                    };
                    var tooltipStyles = {
                        left: position.horizontal.left,
                        top: position.vertical.top + (position.vertical.aligment == 'top' ? (-20) : 20),
                        display: 'block',
                        opacity: '0'
                    };

                    $tooltip.css(tooltipStyles).removeClass('top bottom').addClass(position.vertical.aligment);

                    $('.tooltip-pointer', $tooltip).removeClass('right middle left').addClass(position.horizontal.aligment);

                    $tooltip.finish().animate(resultStyles, animationDuration);
                } else {
                    hide($tooltip);
                }
            });

        }

        function getPosition(preferredVerticalAligment, $pointer, $container, $tooltip) {
            var tooltipHeight = $tooltip.height();
            var tooltipWidth = $tooltip.width();
            var pointerOffset = $pointer.offset();
            var pointerTop = pointerOffset.top - $(window).scrollTop() + $container.scrollTop();
            var containerOffset = $container.offset();
            var containerTop = containerOffset.top - $(window).scrollTop();
            var position = {};

            position.vertical = getVerticalPosition(preferredVerticalAligment, pointerTop, containerTop, tooltipHeight);
            position.horizontal = getHorizontalPosition(pointerOffset.left, containerOffset.left, $container.width(), tooltipWidth);

            function getVerticalPosition(preferredVerticalAligment, pointerTopOffset, containerTopOffset, tooltipHeight) {
                var vertical = {};
                vertical.aligment = getVerticalAligment(preferredVerticalAligment, pointerTopOffset, tooltipHeight);
                vertical.top = pointerTopOffset - containerTopOffset;

                if (vertical.aligment == 'top') {
                    vertical.top -= tooltipHeight + 20;
                }
                if (vertical.aligment == 'bottom') {
                    vertical.top += 20;
                }

                function getVerticalAligment(preferredVerticalAligment, pointerTopOffset, tooltipHeight) {
                    if (preferredVerticalAligment == 'top' && (pointerTopOffset - 100) < tooltipHeight) {
                        return 'bottom';
                    }
                    if (preferredVerticalAligment == 'bottom' && pointerTopOffset + tooltipHeight > $('#view_content').height()) {
                        return 'top';
                    }
                    return preferredVerticalAligment;
                }

                return vertical;
            }

            function getHorizontalPosition(pointerLeftOffset, containerLeftOffset, containerWidth, tooltipWidth) {
                var horizontal = {};
                horizontal.aligment = '';
                horizontal.left = pointerLeftOffset - containerLeftOffset;

                var leftLimit = containerLeftOffset;
                var rightLimit = leftLimit + containerWidth;

                if (pointerLeftOffset + tooltipWidth < rightLimit) {
                    horizontal.left -= 21;
                    horizontal.aligment = 'left';
                } else if (pointerLeftOffset - tooltipWidth + 23 > leftLimit) {
                    horizontal.left -= (tooltipWidth - 23);
                    horizontal.aligment = 'right';
                } else {
                    horizontal.left -= (tooltipWidth / 2);
                    horizontal.aligment = 'middle';
                }
                return horizontal;
            }

            return position;
        }

    }
});
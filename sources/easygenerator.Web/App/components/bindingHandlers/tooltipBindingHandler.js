define(['durandal/app', 'durandal/composition', 'constants', 'components/tooltip/view.html!text'], function (app, composition, constants, view) {
    "use strict";

    return {
        install: install
    };

    function install() {
        var containerSelector = '.shell';
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

            var $tooltipContainer = addTooltipContainer(elementContent);

            function addTooltipContainer(elementContent) {
                var $tooltipContainer = $('<div/>', { 'class': tooltipHolderClass });

                $(containerSelector).append($tooltipContainer);
                ko.utils.setHtml($tooltipContainer, view);

                $('.tooltip-content-holder', $tooltipContainer).html(elementContent);

                $('.tooltip-close-button', $tooltipContainer).click(closeHandler);

                return $tooltipContainer;
            }

            $(window).on('keypress', closeOnEscHandler);
            $(window).on('resize', closeHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $tooltipContainer.remove();
                $(window).unbind('keypress', closeOnEscHandler);
                $(window).unbind('resize', closeHandler);
            });

            function closeOnEscHandler(e) {
                if (e.keyCode == 27) {
                    hide($tooltipContainer);
                }
            }

            function closeHandler() {
                hide($tooltipContainer);
            }

            function hide($container) {
                $container.finish().fadeOut(animationDuration);
            }

            $element.click(function () {
                if (!$tooltipContainer.is(':visible')) {
                    var $container = $(containerSelector);
                    var position = getPosition(preferredVerticalAligment, $element, $container, $tooltipContainer);

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

                    $tooltipContainer.css(tooltipStyles).removeClass('top bottom').addClass(position.vertical.aligment);

                    $('.tooltip-pointer', $tooltipContainer).removeClass('right middle left').addClass(position.horizontal.aligment);

                    $tooltipContainer.finish().animate(resultStyles, animationDuration);
                } else {
                    hide($tooltipContainer);
                }
            });

        }

        function getPosition(preferredVerticalAligment, $pointer, $container, $tooltip) {
            var tooltipHeight = $tooltip.height();
            var tooltipWidth = $tooltip.width();

            var pointerOffset = $pointer.offset();
            var containerOffset = $container.offset();
            var position = {};

            position.vertical = getVerticalPosition(preferredVerticalAligment, pointerOffset.top, containerOffset.top, tooltipHeight);
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
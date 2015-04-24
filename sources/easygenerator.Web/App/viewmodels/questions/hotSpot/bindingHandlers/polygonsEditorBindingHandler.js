define(['durandal/composition', 'components/polygonsEditor/polygonsEditor'], function (composition, polygonsEditor) {
    return {
        install: install
    };

    function install() {

        ko.bindingHandlers.polygonsEditor = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var value = valueAccessor();
                var actions = value.actions;
                var $element = $(element);
                var $designer = $element.closest('.hotspot-designer');
                var $cursorTooltip = $('.cursor-tooltip');
                var dataActions = {
                    addPolygon: actions.addPolygon,
                    updatePolygon: actions.updatePolygon,
                    removePolygon: actions.removePolygon
                };
                var domActions = {
                    setCreateState: setCreateState,
                    setCreatingState: setCreatingState,
                    setResizeState: setResizeState,
                    setResizingState: setResizingState,
                    setDragState: setDragState,
                    setDraggingState: setDraggingState,
                    setHoverOnActiveState: setHoverOnActiveState,
                    updateCursorPosition: updateCursorPosition
                };

                ko.applyBindingsToDescendants(bindingContext, element);
                polygonsEditor.init($element, dataActions, domActions);
                setUpHoverOnCanvas($designer);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $('html').unbind('click', blurHandler);
                });

                return { 'controlsDescendantBindings': true };

                function setUpHoverOnCanvas($element) {
                    $('canvas', $element).hover(function () {
                        $element.addClass('hover');
                    }, function () {
                        $element.removeClass('hover');
                    }).click(function () {      
                        document.activeElement.blur(); //emulate focus instead of calling it directly to avoid scrolling in IE
                        $('html').bind('click', blurHandler);
                    });
                }

                function blurHandler(event) {
                    if (event.target !== polygonsEditor.canvas) {
                        polygonsEditor.deselectAllElements();
                        $('html').unbind('click', blurHandler);
                    }
                }

                function removeState() {
                    $designer.removeClass('create creating resize resizing drag dragging active');
                }

                function setCreateState() {
                    removeState();
                    $designer.addClass('create');
                }

                function setCreatingState() {
                    removeState();
                    $designer.addClass('creating');
                }

                function setResizeState() {
                    removeState();
                    $designer.addClass('resize');
                }

                function setResizingState() {
                    removeState();
                    $designer.addClass('resizing');
                }

                function setDragState() {
                    removeState();
                    $designer.addClass('drag');
                }

                function setDraggingState() {
                    removeState();
                    $designer.addClass('dragging');
                }

                function setHoverOnActiveState() {
                    removeState();
                    $designer.addClass('active');
                }

                function updateCursorPosition(x, y) {
                    if (polygonsEditor.canvas) {
                        var containerOffset = $(polygonsEditor.canvas).offset();
                        var containerOffsetLeft = containerOffset.left;
                        var containerOffsetTop = containerOffset.top;
                        setTooltipPostion($cursorTooltip[0], x - containerOffsetLeft, y - containerOffsetTop);
                    }

                    function setTooltipPostion(cursorTooltip, top, left) {
                        cursorTooltip.style.marginLeft = top + 5 + "px";
                        cursorTooltip.style.marginTop = left + 5 + "px";
                    }

                }
            },
            update: function (element, valueAccessor) {
                var value = valueAccessor();
                var background = value.background;
                var polygons = value.polygons;
                polygonsEditor.updateCanvasSize(background.width(), background.height());
                polygonsEditor.updatePolygons(polygons);
            }
        };

        composition.addBindingHandler('polygonsEditor');
    }
});
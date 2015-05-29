define(['durandal/composition', 'components/polygonsEditor/polygonsEditor', 'widgets/cursorTooltip/viewmodel'], function (composition, PolygonsEditor, cursorTooltip) {
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
                var domActions = {
                    setCreateState: setCreateState,
                    setCreatingState: setCreatingState,
                    setResizeState: setResizeState,
                    setResizingState: setResizingState,
                    setDragState: setDragState,
                    setDraggingState: setDraggingState,
                    setHoverOnActiveState: setHoverOnActiveState
                };

                var polygonsEditor = new PolygonsEditor($element, domActions);

                ko.utils.domData.set(element, 'ko_polygonEditor', polygonsEditor);
                
                polygonsEditor.on(polygonsEditor.events.polygonUpdated, function (polygonViewModel, points) {
                    actions.updatePolygon.end(polygonViewModel, points);
                });

                polygonsEditor.on(polygonsEditor.events.polygonDeleted, function (polygonViewModel) {
                    actions.removePolygon(polygonViewModel);
                });

                polygonsEditor.on(polygonsEditor.events.polygonBeforeAdded, function (points) {
                    actions.addPolygon(points).then(function (id) {
                        polygonsEditor.fire(polygonsEditor.events.polygonAfterAdded, id);
                    });
                });

                ko.applyBindingsToDescendants(bindingContext, element);
                setUpHoverOnCanvas($designer);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $('html').unbind('click', blurHandler);
                    cursorTooltip.hide();
                    ko.utils.domData.clear(element);
                });

                return { 'controlsDescendantBindings': true };

                function setUpHoverOnCanvas($element) {
                    $('canvas', $element).hover(function () {
                        cursorTooltip.show();
                        $element.addClass('hover');
                    }, function () {
                        cursorTooltip.hide();
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
                    cursorTooltip.changeText('hotSpotTooltipCreate');
                    $designer.addClass('create');
                }

                function setCreatingState() {
                    removeState();
                    cursorTooltip.changeText('');
                    $designer.addClass('creating');
                }

                function setResizeState() {
                    removeState();
                    cursorTooltip.changeText('hotSpotTooltipResize');
                    $designer.addClass('resize');
                }

                function setResizingState() {
                    removeState();
                    cursorTooltip.changeText('');
                    $designer.addClass('resizing');
                }

                function setDragState() {
                    removeState();
                    cursorTooltip.changeText('hotSpotTooltipDrag');
                    $designer.addClass('drag');
                }

                function setDraggingState() {
                    removeState();
                    cursorTooltip.changeText('');
                    $designer.addClass('dragging');
                }

                function setHoverOnActiveState() {
                    removeState();
                    cursorTooltip.changeText('hotSpotTooltipActive');
                    $designer.addClass('active');
                }
            },
            update: function (element, valueAccessor) {
                var value = valueAccessor();
                var background = value.background;
                var polygons = value.polygons;
                var polygonsEditor = ko.utils.domData.get(element, 'ko_polygonEditor');
                polygonsEditor.updateCanvasSize(background.width(), background.height());
                polygonsEditor.updatePolygons(polygons);
            }
        };

        composition.addBindingHandler('polygonsEditor');
    }
});
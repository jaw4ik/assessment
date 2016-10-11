import PolygonsEditor from 'components/polygonsEditor/polygonsEditor';
import cursorTooltip from 'widgets/cursorTooltip/viewmodel';
import PolygonShape from 'components/polygonsEditor/hotspotOnImageShapeModel';
import composition from 'durandal/composition';
import _ from 'underscore';
import ko from 'knockout';

ko.bindingHandlers.hotspotOnImage = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element = $(element),
            isEditing = valueAccessor().isEditing,
            saveHandler = valueAccessor().save,
            actions = valueAccessor().actions,
            that = bindingContext.$root;

        var domActions = {
            setCreateState: setCreateState,
            setCreatingState: setCreatingState,
            setResizeState: setResizeState,
            setResizingState: setResizingState,
            setDragState: setDragState,
            setDraggingState: setDraggingState,
            setHoverOnActiveState: setHoverOnActiveState
        };

        $element.append('<span class="hotspot-overlay">');

        var editor = new PolygonsEditor($element, domActions, PolygonShape);

        ko.utils.domData.set(element, 'ko_polygonEditor', editor);

        setUpHoverOnCanvas($element);

        editor.on(editor.events.polygonUpdated, function (polygonViewModel, points) {
            actions.update(polygonViewModel.id, points);
            saveData();
        });

        editor.on(editor.events.polygonDeleted, function (polygonViewModel) {
            actions.delete(polygonViewModel.id);
            saveData();
        });

        editor.on(editor.events.polygonBeforeAdded, function (points) {
            var polygon = actions.add(points);
            editor.fire(editor.events.polygonAfterAdded, polygon.id);
            saveData();
            polygon.onClick($('canvas', $element)[0]);
        });

        function removeState() {
            $element.removeClass('create creating resize resizing drag dragging active');
        }

        function setCreateState() {
            removeState();
            cursorTooltip.changeText('hotSpotTooltipCreate');
            $element.addClass('create');
        }

        function setCreatingState() {
            removeState();
            cursorTooltip.changeText('');
            $element.addClass('creating');
        }

        function setResizeState() {
            removeState();
            cursorTooltip.changeText('hotSpotTooltipResize');
            $element.addClass('resize');
        }

        function setResizingState() {
            removeState();
            cursorTooltip.changeText('');
            $element.addClass('resizing');
        }

        function setDragState() {
            removeState();
            cursorTooltip.changeText('hotSpotTooltipDrag');
            $element.addClass('drag');
        }

        function setDraggingState() {
            removeState();
            cursorTooltip.changeText('');
            $element.addClass('dragging');
        }

        function setHoverOnActiveState() {
            removeState();
            cursorTooltip.changeText('hotSpotTooltipActive');
            $element.addClass('active');
        }

        function saveData() {
            if (_.isFunction(saveHandler)) {
                saveHandler.call(that, viewModel);
            }
        }

        function setUpHoverOnCanvas($element) {
            $('canvas', $element)
                .hover(
                    function () {
                        cursorTooltip.show();
                        $element.addClass('hover');
                    }, function () {
                        cursorTooltip.hide();
                        $element.removeClass('hover');
                    }
                )
                .click(function () {
                        startEditing();
                        document.activeElement.blur();
                    }
                );
        }

        function startEditing() {
            if (!isEditing()) {
                isEditing(true);
                $('html').bind('click', blurEvent);
            }
        }

        function blurEvent(event) {
            if (event.target !== document.querySelector('html') && event.target !== editor.canvas) {
                isEditing(false);
                editor.deselectAllElements();
                $('html').unbind('click', blurEvent);
            }
        }
                
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $('html').unbind('click', blurEvent);
            cursorTooltip.hide();
            ko.utils.domData.clear(element);
        });
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            editor = ko.utils.domData.get(element, 'ko_polygonEditor'),
            value = valueAccessor(),
            background = value.background,
            polygons = value.polygons;

        if (polygons().length) {
            $element.removeClass('empty');
        } else {
            $element.addClass('empty');
        }

        if (_.isNullOrUndefined(background.width()) || _.isNullOrUndefined(background.height())) {
            return;
        }

        editor.updateCanvasSize(background.width(), background.height());
        editor.updatePolygons(polygons);
    }
};

composition.addBindingHandler('hotspotOnImage');

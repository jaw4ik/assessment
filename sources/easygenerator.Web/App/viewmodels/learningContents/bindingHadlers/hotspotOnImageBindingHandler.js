define(['durandal/composition', 'durandal/system', 'components/polygonsEditor/polygonsEditor',
        'widgets/hotSpotOnImageTextEditor/viewmodel', 'viewmodels/learningContents/hotspotOnImage/utils/polygon',
        'viewmodels/learningContents/hotspotOnImage/utils/hotspotOnImageParser',
        'widgets/hotspotCursorTooltip/viewmodel'],
    function (composition, system, PolygonsEditor, hotSpotOnImageTextEditor, PolygonModel, parser, cursorTooltip) {
        'use strict';

        ko.bindingHandlers.hotspotOnImage = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element),
                    data = valueAccessor().data,
                    isEditing = valueAccessor().isEditing,
                    saveHandler = valueAccessor().save,
                    focusHandler = valueAccessor().focus,
                    blurHandler = valueAccessor().blur,
                    autosaveInterval = valueAccessor().autosaveInterval || 60000,
                    saveIntervalId = null,
                    that = bindingContext.$root,
                    uploadBackground = valueAccessor().uploadBackground,
                    $wrapper = $element.closest('.hotspot-on-image-container');

                $element.html(data());

                var $spotsBtns = $element.find('.spot-btn');

                $spotsBtns.each(function (index, elem) {
                    $(elem).on('click', function () {
                        var $that = $(this);
                        var $parent = $that.parent();
                        var top = $parent.offset().top + ($parent.height() / 2);
                        var left = $parent.offset().left + $parent.width();
                        hotSpotOnImageTextEditor.show($parent.attr('data-text'), top, left, function (text) {
                            $parent.attr('data-text', text);
                            saveData();
                        });
                    });
                });

                $element.attr('tabindex', 0).on('focus', function () {
                    if (!isEditing())
                        isEditing(true);

                    focusHandler.call(that, viewModel);

                    saveIntervalId = setInterval(saveData, autosaveInterval);
                }).on('blur', function () {
                    clearInterval(saveIntervalId);

                    isEditing(false);

                    if (!!blurHandler) {
                        blurHandler.call(that, viewModel);
                    }
                });

                var $editor = $element.find('.hotspotOnImage');

                $('.upload-background-image', $wrapper).on('click', function () {
                    uploadBackground(function (url) {
                        parser.updateImage($editor, url);
                        saveData();
                    });
                });

                var domActions = {
                    setCreateState: setCreateState,
                    setCreatingState: setCreatingState,
                    setResizeState: setResizeState,
                    setResizingState: setResizingState,
                    setDragState: setDragState,
                    setDraggingState: setDraggingState,
                    setHoverOnActiveState: setHoverOnActiveState
                };

                $element.data('polygonsEditor', {
                    polygonsEditor: new PolygonsEditor($editor, domActions),
                    polygons: ko.observableArray([])
                });

                var editor = $element.data('polygonsEditor');

                editor.polygonsEditor.on('polygon:dragging', function (polygonViewModel, points) {
                    parser.updateSpot(polygonViewModel.id, points, $editor);
                });

                editor.polygonsEditor.on('polygon:updated', function (polygonViewModel, points) {
                    parser.updateSpot(polygonViewModel.id, points, $editor);

                    var polygon = _.find(editor.polygons(), function (item) {
                        return item.id == polygonViewModel.id;
                    });

                    polygon.points(points);
                    saveData();
                });

                editor.polygonsEditor.on('polygon:deleted', function (polygonViewModel) {
                    parser.removeSpot(polygonViewModel.id, $editor);
                    editor.polygons(_.reject(editor.polygons(), function (polygon) {
                        return polygon.id == polygonViewModel.id;
                    }));
                    saveData();
                });

                editor.polygonsEditor.on('polygon:add', function (points) {
                    var polygon = new PolygonModel('', points);

                    var $spot = parser.generateSpot(polygon.id, points);
                    $('.spot-btn', $spot).on('click', function () {
                        var $that = $(this);
                        var $parent = $that.parent();
                        var top = $parent.offset().top + ($parent.height() / 2);
                        var left = $parent.offset().left + $parent.width();
                        hotSpotOnImageTextEditor.show($parent.attr('data-text'), top, left, function (text) {
                            $parent.attr('data-text', text);
                            saveData();
                        });
                    });
                    $editor.prepend($spot);

                    editor.polygons.push(polygon);
                    saveData();
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

                ko.applyBindingsToDescendants(bindingContext, element);

                setUpHoverOnCanvas($element);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $('html').unbind('click', blurEvent);
                    $element.removeData('polygonsEditor');
                });

                return { 'controlsDescendantBindings': true };

                function saveData() {
                    if (!!saveHandler) {
                        var $clone = $element.clone();
                        var $canvas = $clone.find('canvas');
                        $canvas.remove();
                        data($clone.html());
                        saveHandler.call(that, viewModel);
                    }
                }

                function setUpHoverOnCanvas($element) {
                    $('canvas', $element).hover(function () {
                        cursorTooltip.show();
                        $element.addClass('hover');
                    }, function () {
                        cursorTooltip.hide();
                        $element.removeClass('hover');
                    }).click(function () {
                        $('html').bind('click', blurEvent);
                    });
                }

                function blurEvent(event) {
                    if (event.target !== editor.polygonsEditor.canvas) {
                        editor.polygonsEditor.deselectAllElements();
                        $('html').unbind('click', blurEvent);
                    }
                }
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element),
                    editor = $element.data('polygonsEditor');

                var imageUrl = parser.getImageUrl(valueAccessor().data());
                var background = new Image();
                background.onload = function () {
                    editor.polygonsEditor.updateCanvasSize(this.width, this.height);
                };
                background.src = imageUrl;

                editor.polygons(parser.getPolygons(valueAccessor().data()));

                if (editor.polygons().length) {
                    $element.removeClass('empty');
                } else {
                    $element.addClass('empty');
                }

                editor.polygonsEditor.updatePolygons(editor.polygons);
            }
        };

        composition.addBindingHandler('hotspotOnImage');
    });
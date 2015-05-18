define(['durandal/composition', 'durandal/system', 'components/polygonsEditor/polygonsEditor',
        'widgets/hotSpotOnImageTextEditor/viewmodel', 'viewmodels/learningContents/components/hotspotParser',
        'widgets/hotspotCursorTooltip/viewmodel', 'viewmodels/learningContents/components/polygonModel',
        'components/polygonsEditor/hotspotOnImageShapeModel'],
    function (composition, system, PolygonsEditor, hotSpotOnImageTextEditor, parser, cursorTooltip, PolygonModel, PolygonShape) {
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

                $('.upload-background-image', $wrapper).on('click', function () {
                    uploadBackground(function (url) {
                        loadImage(url);
                        data(parser.updateImage(data(), url));
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

                var editor = new PolygonsEditor($element, domActions, PolygonShape),
                    domData = {
                        polygonsEditor: editor,
                        polygons: ko.observableArray([])
                    };

                ko.utils.domData.set(element, 'ko_polygonEditor', domData);

                loadImage();

                editor.on('polygon:updated', function (polygonViewModel, points) {
                    data(parser.updateSpot(data(), polygonViewModel.id, polygonViewModel.text, points));
                    saveData();
                });

                editor.on('polygon:deleted', function (polygonViewModel) {
                    data(parser.removeSpot(data(), polygonViewModel.id));
                    saveData();
                });

                editor.on('polygon:add', function (points) {
                    data(parser.createSpot(data(), points));
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

                function saveData() {
                    if (!!saveHandler) {
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
                    if (event.target !== editor.canvas) {
                        editor.deselectAllElements();
                        $('html').unbind('click', blurEvent);
                    }
                }

                function loadImage(url) {
                    var imageUrl = url || parser.getImageUrl(valueAccessor().data());

                    var background = new Image();
                    background.onload = function () {
                        $element.width(this.width);
                        $element.height(this.height);
                        $element.css('background-image', 'url(' + imageUrl + ')');
                        editor.updateCanvasSize(this.width, this.height);
                    };
                    background.src = imageUrl;
                }

                setUpHoverOnCanvas($element);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $('html').unbind('click', blurEvent);
                    ko.utils.domData.clear(element);
                });
            },
            update: function (element, valueAccessor) {
                var $element = $(element),
                    editor = ko.utils.domData.get(element, 'ko_polygonEditor');

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
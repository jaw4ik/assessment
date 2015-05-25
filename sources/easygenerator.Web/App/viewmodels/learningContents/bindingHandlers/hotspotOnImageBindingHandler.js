define(['durandal/composition', 'components/polygonsEditor/polygonsEditor', 'viewmodels/learningContents/components/hotspotParser',
        'widgets/hotspotCursorTooltip/viewmodel', 'components/polygonsEditor/hotspotOnImageShapeModel'],
    function (composition, PolygonsEditor, parser, cursorTooltip, PolygonShape) {
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

                $('.upload-background-image', $wrapper).on('click', function () {
                    uploadBackground(function (url) {
                        loadImage(url, function (width, height) {
                            data(parser.updateImage(data(), url, width, height));
                            saveData();
                        });
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
                        polygons: ko.observableArray([]),
                        updateCallback: updateSpot.bind(null, data)
                    };

                ko.utils.domData.set(element, 'ko_polygonEditor', domData);

                loadImage();

                startEditing();

                setUpHoverOnCanvas($element);

                editor.on(editor.events.polygonUpdated, function (polygonViewModel, points) {
                    updateSpot(data, polygonViewModel.id, polygonViewModel.text, points);
                });

                editor.on(editor.events.polygonDeleted, function (polygonViewModel) {
                    data(parser.removeSpot(data(), polygonViewModel.id));
                    saveData();
                });

                editor.on(editor.events.polygonBeforeAdded, function (points) {
                    var spot = parser.createSpot(data(), points);
                    data(spot.data);
                    saveData();
                    editor.fire(editor.events.polygonAfterAdded, spot.id);
                });

                function updateSpot(data, id, text, points) {
                    data(parser.updateSpot(data(), id, text, points));
                    saveData();
                }

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
                        if (!isEditing()) {
                            startEditing();
                        }
                        document.activeElement.blur();
                    });
                }

                function startEditing() {
                    if (!isEditing())
                        isEditing(true);

                    focusHandler.call(that, viewModel);
                    saveIntervalId = setInterval(saveData, autosaveInterval);
                    $('html').bind('click', blurEvent);
                }

                function endEditing() {
                    clearInterval(saveIntervalId);
                    isEditing(false);
                    if (!!blurHandler) {
                        blurHandler.call(that, viewModel);
                    }
                }

                function blurEvent(event) {
                    if (event.target !== editor.canvas) {
                        endEditing();
                        editor.deselectAllElements();
                        $('html').unbind('click', blurEvent);
                    }
                }

                function loadImage(url, callback) {
                    var imageUrl = url || parser.getImageUrl(valueAccessor().data());

                    var background = new Image();
                    background.onload = function () {
                        $element.width(this.width);
                        $element.height(this.height);
                        $element.css('background-image', 'url(' + imageUrl + ')');
                        editor.updateCanvasSize(this.width, this.height);
                        if (_.isFunction(callback)) {
                            callback(this.width, this.height);
                        }
                    };
                    background.src = imageUrl;
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
                    data = valueAccessor().data;

                editor.polygons(parser.getPolygons(data(), editor.updateCallback));

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
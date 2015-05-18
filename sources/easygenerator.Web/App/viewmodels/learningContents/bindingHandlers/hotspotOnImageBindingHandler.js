define(['durandal/composition', 'durandal/system', 'components/polygonsEditor/polygonsEditor',
        'widgets/hotSpotOnImageTextEditor/viewmodel', 'viewmodels/learningContents/components/hotspotParser',
        'widgets/hotspotCursorTooltip/viewmodel'],
    function (composition, system, PolygonsEditor, hotSpotOnImageTextEditor, parser, cursorTooltip) {
        'use strict';

        var PolygonModel = function (id, points, text, onClick) {
            this.id = id || system.guid();
            this.points = ko.observable(points);
            this.text = text || '';
            this.onClick = onClick || function () { };
        };

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

                var editor = new PolygonsEditor($element, domActions),
                    polygons = ko.observableArray(parser.getPolygons(valueAccessor().data())),
                    domData = ko.observable({
                        polygonsEditor: editor,
                        polygons: ko.observableArray([])
                    });

                ko.utils.domData.set(element, 'ko_polygonEditor', domData);

                loadImage();

                editor.on('polygon:updated', function (polygonViewModel, points) {
                    var polygon = _.find(polygons(), function (item) {
                        return item.id == polygonViewModel.id;
                    });

                    polygon.points(points);
                    saveData();
                });

                editor.on('polygon:deleted', function (polygonViewModel) {
                    polygons(_.reject(polygons(), function (polygon) {
                        return polygon.id == polygonViewModel.id;
                    }));
                    saveData();
                });

                editor.on('polygon:add', function (points) {
                    console.log('add pol');
                    var polygon = new PolygonModel('', points);
                    polygons.push(polygon);
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
                        data(parser.createSpots(data(), polygons()));
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

                ko.applyBindingsToDescendants(bindingContext, element);

                setUpHoverOnCanvas($element);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $('html').unbind('click', blurEvent);
                    ko.utils.domData.clear(element);
                });

                return { 'controlsDescendantBindings': true };
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element),
                    editor = ko.utils.domData.get(element, 'ko_polygonEditor');
                editor().polygons(parser.getPolygons(valueAccessor().data()));

                if (editor().polygons().length) {
                    $element.removeClass('empty');
                } else {
                    $element.addClass('empty');
                }

                editor().polygonsEditor.updatePolygons(editor().polygons);
            }
        };

        composition.addBindingHandler('hotspotOnImage');
    });
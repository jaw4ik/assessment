define(['localization/localizationManager', 'constants', 'components/polygonsEditor/polygonShape'],
    function (localizationManager, constants, PolygonShape) {

        "use strict";

        var editor = {
            minSize: 10, //px
            hitOptions: {
                segments: true,
                stroke: false,
                fill: true,
                tolerance: 5
            },
            polygonToAdd: null,
            polygons: [],
            selectedPath: null,
            selectedSegment: null
        };

        var polygonsEditor = {
            init: init,
            updateCanvasSize: updateCanvasSize,
            $element: null,
            canvas: null,
            polygons: null,
            dataActions: null,
            domActions: null,
            updatePolygons: updatePolygons,
            deselectAllElements: deselectAllElements
        };

        return polygonsEditor;

        function init($element, dataActions, domActions) {
            polygonsEditor.$element = $element;

            polygonsEditor.dataActions = dataActions;
            polygonsEditor.domActions = domActions;
            polygonsEditor.canvas = generateCanvas();

            $element.prepend(polygonsEditor.canvas);
            paper.setup(polygonsEditor.canvas);
            paper.settings.handleSize = 10;

            polygonsEditor.domActions.setCreateState(polygonsEditor.canvas);
            editor.selectedPath = null;
            editor.selectedSegment = null;

            var rectangleTool = new paper.Tool();

            rectangleTool.onMouseDown = function (event) {
                if (event.event.button === 0) {
                    deselectAllElements();
                    var hitResult = paper.project.hitTest(event.point, editor.hitOptions);
                    if (hitResult) {
                        if (hitResult.type === 'segment') {
                            editor.selectedSegment = hitResult.segment;
                            polygonsEditor.domActions.setResizingState();
                        } else if (hitResult.type === 'fill' && hitResult.item != editor.selectedPath) {
                            var path = editor.selectedPath = hitResult.item;
                            path.selected = true;
                            path.bringToFront();
                            polygonsEditor.domActions.setDraggingState();
                        }
                    } else {
                        addPolygonStart(event.point);
                        polygonsEditor.domActions.setCreatingState();
                    }
                }
            };

            rectangleTool.onMouseUp = function (event) {
                polygonsEditor.domActions.updateCursorPosition(event.event.pageX, event.event.pageY);
                if (event.item instanceof paper.Path) {
                    polygonsEditor.domActions.setHoverOnActiveState();
                } else if (event.item instanceof paper.Segment) {
                    polygonsEditor.domActions.setResizeState();
                }

                if (editor.selectedPath) {
                    updatePolygonEnd(editor.selectedPath);
                } else if (editor.selectedSegment) {
                    var sizeIsValid = pathSizeIsValid(editor.selectedSegment.path);

                    if (editor.polygonToAdd) {
                        if (sizeIsValid) {
                            addPolygonEnd();
                        } else {
                            editor.selectedSegment.path.remove();
                            editor.selectedSegment = null;
                            paper.view.draw();
                            polygonsEditor.domActions.setCreateState();
                        }
                        editor.polygonToAdd = null;
                    } else {
                        if (sizeIsValid) {
                            updatePolygonEnd(editor.selectedSegment.path);
                        } else {
                            removePolygonByPath(editor.selectedSegment.path);
                        }
                    }
                }
            };

            rectangleTool.onMouseMove = function (event) {
                polygonsEditor.domActions.updateCursorPosition(event.event.pageX, event.event.pageY);
                var hitResult = paper.project.hitTest(event.point, editor.hitOptions);
                if (hitResult) {
                    if (hitResult.type === 'segment') {
                        polygonsEditor.domActions.setResizeState();
                    } else if (hitResult.type === 'fill') {
                        if (hitResult.item.selected) {
                            polygonsEditor.domActions.setHoverOnActiveState();
                        } else {
                            polygonsEditor.domActions.setDragState();
                        }
                    }
                } else {
                    polygonsEditor.domActions.setCreateState();
                }
            };

            rectangleTool.onMouseDrag = function (event) {
                var size = paper.view.size;
                var viewRect = new paper.Rectangle(0, 0, size.width, size.height);
                var deltaX = event.delta.x;
                var deltaY = event.delta.y;
                if (editor.selectedSegment) {
                    var segment = editor.selectedSegment;
                    var point = segment.point.clone();
                    point.x += deltaX;
                    point.y += deltaY;
                    if (viewRect.contains(point)) {
                        if (segment.path.segments.length === 4) {
                            //move prev and next segment to keep rectangle angles
                            var prev = segment.previous;
                            var next = segment.next;
                            if (prev.point.x === segment.point.x && next.point.y === segment.point.y) {
                                prev.point.x += deltaX;
                                next.point.y += deltaY;
                            } else if (prev.point.y === segment.point.y && next.point.x === segment.point.x) {
                                prev.point.y += deltaY;
                                next.point.x += deltaX;
                            }
                        }

                        segment.point.x += deltaX;
                        segment.point.y += deltaY;
                        segment.path.selected = true;
                        markPolygonAsDitryByPath(segment.path);
                    }
                } else if (editor.selectedPath) {
                    var path = editor.selectedPath;
                    var bounds = path.bounds.clone();
                    bounds.x += deltaX;
                    bounds.y += deltaY;
                    if (viewRect.contains(bounds)) {
                        path.position.x += deltaX;
                        path.position.y += deltaY;
                        markPolygonAsDitryByPath(path);
                    }
                }
            };

            rectangleTool.onKeyDown = function (event) {
                if (event.key === 'delete' && paper.project.selectedItems.length > 0) { // delete
                    while (paper.project.selectedItems.length > 0) {
                        var selectedItem = paper.project.selectedItems[0];
                        if (selectedItem instanceof paper.Path) {
                            removePolygonByPath(selectedItem);
                        } else {
                            selectedItem.remove();
                        }
                    }

                    // Prevent the key event from bubbling
                    return false;
                }
            };

            return polygonsEditor.canvas;

            function addPolygonStart(startPoint) {
                var rectangle = new paper.Rectangle(startPoint, new paper.Size(1, 1));
                editor.polygonToAdd = new PolygonShape(null, rectangle);
                editor.polygonToAdd.path.selected = true;
                editor.selectedSegment = editor.polygonToAdd.path.segments[2];
            }

            function addPolygonEnd() {
                editor.polygons.push(editor.polygonToAdd);
                addPolygon(editor.polygonToAdd).then(function (id) {
                    var polygon = findPolygonById(id);
                    polygon.path.selected = true;
                    paper.view.draw();
                });
            }

            function addPolygon(polygonToAdd) {
                var points = getPointsFromPath(polygonToAdd.path);
                return polygonsEditor.dataActions.addPolygon(points);
            }

            function markPolygonAsDitryByPath(path) {
                var polygon = findPolygonByPath(path);
                if (polygon && !polygon.isDitry) {
                    polygon.markAsDirty();
                }
            }

            function updatePolygonEnd(path) {
                updatePolygonByPath(path);
            }

            function updatePolygonByPath(path) {
                var polygon = findPolygonByPath(path);
                if (polygon && polygon.isDitry) {
                    polygon.markAsClean();
                    var polygonViewModel = findPolygonViewModelById(polygon.id);
                    if (polygonViewModel) {
                        var points = getPointsFromPath(path);
                        polygonsEditor.dataActions.updatePolygon.end(polygonViewModel, points);
                    } else {
                        throw 'Polygon ViewModel in null';
                    }
                }
            }

            function removePolygonByPath(path) {
                var polygon = findPolygonByPath(path);
                if (polygon) {
                    var polygonViewModel = findPolygonViewModelById(polygon.id);
                    if (polygonViewModel) {
                        polygonsEditor.dataActions.removePolygon(polygonViewModel);
                    }
                    editor.polygons.splice(editor.polygons.indexOf(polygon), 1);
                }
                path.remove();
            }
            
            function pathSizeIsValid(path) {
                return path.bounds.width > editor.minSize && path.bounds.height > editor.minSize;
            }

            function generateCanvas() {
                var canvas = document.createElement('canvas');
                canvas.className = "hotspot-area";
                return canvas;
            }
        }

        function deselectAllElements() {
            paper.project.activeLayer.selected = false;
            editor.selectedPath = null;
            editor.selectedSegment = null;
            paper.view.draw();
        }

        function getPointsFromPath(path) {
            return _.map(path.segments, function (segment) {
                var point = segment.point;
                return { x: Math.round(point.x), y: Math.round(point.y) };
            });
        }

        function findPolygonByPath(path) {
            return _.find(editor.polygons, function (polygon) {
                return polygon.path === path;
            });
        }

        function findPolygonById(id) {
            return _.find(editor.polygons, function (polygon) {
                return polygon.id === id;
            });
        }

        function findPolygonViewModelById(id) {
            return _.find(polygonsEditor.polygons(), function (polygonViewModel) {
                return polygonViewModel.id === id;
            });
        }

        function updateCanvasSize(width, height) {
            var $canvas = $(polygonsEditor.canvas);
            if ($canvas[0].width != width || $canvas[0].height != height) {
                paper.view.viewSize = new paper.Size(width, height);
                paper.view.draw();
            }
        }

        function updatePolygons(polygons) {
            polygonsEditor.polygons = polygons;
            _.each(polygons(), function (polygon) {
                var polygonInEditor = _.find(editor.polygons, function (polygonShape) { return polygon.id === polygonShape.id; });
                if (polygonInEditor) {
                    polygonInEditor.updatePoints(polygon.points());
                } else {
                    editor.polygons.push(new PolygonShape(polygon.id, polygon.points()));
                }
            });
            editor.polygons = _.filter(editor.polygons, function (polygonShape) {
                if (polygonShape.id != null && _.find(polygons(), function (polygon) { return polygon.id === polygonShape.id; })) {
                    return true;
                } else {
                    polygonShape.path.remove();
                    return false;
                }
            });
            paper.view.draw();
        }

    }
);
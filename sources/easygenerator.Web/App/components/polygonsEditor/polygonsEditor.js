define(['localization/localizationManager', 'constants', 'components/polygonsEditor/polygonShape'],
    function (localizationManager, constants, PolygonShape) {

        "use strict";

        var Editor = function () {
            this.minSize = 10; //px
            this.hitOptions = {
                segments: true,
                stroke: false,
                fill: true,
                tolerance: 5
            };
            this.polygonToAdd = null;
            this.polygons = [];
            this.selectedPath = null;
            this.selectedSegment = null;
        };

        var PolygonEditor = function ($element, domActions, polygonShape) {
            this._paper = new paper.PaperScope();
            this._editor = new Editor();
            this._PolygonShape = polygonShape || PolygonShape;

            this.$element = null;
            this.updateCanvasSize = updateCanvasSize;
            this.canvas = null;
            this.polygons = null;
            this.domActions = null;
            this.updatePolygons = updatePolygons;
            this.deselectAllElements = deselectAllElements;

            this.events = {
                polygonBeforeAdded: 'polygon:beforeAdded',
                polygonAfterAdded: 'polygon:afterAdded',
                polygonDeleted: 'polygon:deleted',
                polygonUpdated: 'polygon:updated'
            };

            var eventsQueue = [];

            this.on = function (event, callback) {
                if (typeof eventsQueue[event] === 'undefined') {
                    eventsQueue[event] = [];
                }

                eventsQueue[event].push(callback);
            };

            this.fire = function (event) {
                var queue = eventsQueue[event];

                if (_.isNullOrUndefined(queue)) {
                    return;
                }

                var args = [];

                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }

                for (var j = 0; j < queue.length; j++) {
                    queue[j].apply(this, args);
                }
            };

            init.call(this, $element, domActions);
        };

        return PolygonEditor;

        function init($element, domActions) {
            var that = this;
            that.$element = $element;

            that.domActions = domActions;
            that.canvas = generateCanvas();

            $element.prepend(that.canvas);
            that._paper.setup(that.canvas);
            that._paper.settings.handleSize = 10;

            that.domActions.setCreateState(that.canvas);
            that._editor.selectedPath = null;
            that._editor.selectedSegment = null;

            var rectangleTool = new that._paper.Tool();

            rectangleTool.onMouseDown = function (event) {
                if (event.event.button === 0) {
                    that.deselectAllElements();
                    var hitResult = that._paper.project.hitTest(event.point, that._editor.hitOptions);
                    if (hitResult) {
                        if (hitResult.type === 'segment') {
                            that._editor.selectedSegment = hitResult.segment;
                            that.domActions.setResizingState();
                        } else if (hitResult.type === 'fill' && hitResult.item != that._editor.selectedPath) {
                            var path = that._editor.selectedPath = hitResult.item;
                            path.selected = true;
                            path.bringToFront();
                            if (!(path.parent instanceof paper.Layer)) {
                                var raster = path.parent.getItem({ class: paper.Raster });
                                if (raster) {
                                    raster.bringToFront();
                                }
                            }
                            that.domActions.setDraggingState();
                        }
                    } else {
                        addPolygonStart(event.point);
                        that.domActions.setCreatingState();
                    }
                }
            };

            rectangleTool.onMouseUp = function (event) {
                if (event.item instanceof that._paper.Path) {
                    that.domActions.setHoverOnActiveState();
                } else if (event.item instanceof that._paper.Segment) {
                    that.domActions.setResizeState();
                }

                if (that._editor.selectedPath) {
                    updatePolygonEnd(that._editor.selectedPath);
                } else if (that._editor.selectedSegment) {
                    var sizeIsValid = pathSizeIsValid(that._editor.selectedSegment.path);

                    if (that._editor.polygonToAdd) {
                        if (sizeIsValid) {
                            addPolygonEnd();
                        } else {
                            that._editor.selectedSegment.path.remove();
                            that._editor.selectedSegment = null;
                            that._paper.view.draw();
                            that.domActions.setCreateState();
                        }
                        that._editor.polygonToAdd = null;
                    } else {
                        if (sizeIsValid) {
                            updatePolygonEnd(that._editor.selectedSegment.path);
                        } else {
                            removePolygonByPath(that._editor.selectedSegment.path);
                        }
                    }
                }
            };

            rectangleTool.onMouseMove = function (event) {
                var hitResult = that._paper.project.hitTest(event.point, that._editor.hitOptions);
                if (hitResult) {
                    if (hitResult.type === 'segment') {
                        that.domActions.setResizeState();
                    } else if (hitResult.type === 'fill') {
                        if (hitResult.item.selected) {
                            that.domActions.setHoverOnActiveState();
                        } else {
                            that.domActions.setDragState();
                        }
                    }
                } else {
                    that.domActions.setCreateState();
                }
            };

            rectangleTool.onMouseDrag = function (event) {
                var raster;
                var size = that._paper.view.size;
                var viewRect = new that._paper.Rectangle(0, 0, size.width, size.height);
                var deltaX = event.delta.x;
                var deltaY = event.delta.y;


                if (that._editor.selectedSegment) {
                    var segment = that._editor.selectedSegment;
                    if (!(segment.path.parent instanceof paper.Layer)) {
                        raster = segment.path.parent.getItem({ class: paper.Raster });
                        if (raster) {
                            raster.remove();
                        }
                    }
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
                } else if (that._editor.selectedPath) {
                    var path = that._editor.selectedPath;
                    if (!(path.parent instanceof paper.Layer)) {
                        raster = path.parent.getItem({ class: paper.Raster });
                        if (raster) {
                            raster.remove();
                        }
                    }
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
                if (event.key === 'delete' && that._paper.project.selectedItems.length > 0) { // delete
                    while (that._paper.project.selectedItems.length > 0) {
                        var selectedItem = that._paper.project.selectedItems[0];
                        if (selectedItem instanceof that._paper.Path) {
                            removePolygonByPath(selectedItem);
                        } else {
                            selectedItem.remove();
                        }
                    }

                    // Prevent the key event from bubbling
                    return false;
                }
            };

            that.on(that.events.polygonAfterAdded, function (id) {
                var polygon = findPolygonById.call(that, id);
                polygon.path.selected = true;
                that._paper.view.draw();
            });

            return that.canvas;

            function addPolygonStart(startPoint) {
                var rectangle = new that._paper.Rectangle(startPoint, new that._paper.Size(1, 1));
                that._editor.polygonToAdd = new that._PolygonShape(null, rectangle);
                that._editor.polygonToAdd.path.selected = true;
                that._editor.selectedSegment = that._editor.polygonToAdd.path.segments[2];
            }

            function addPolygonEnd() {
                that._editor.polygons.push(that._editor.polygonToAdd);
                addPolygon(that._editor.polygonToAdd);
            }

            function addPolygon(polygonToAdd) {
                var points = getPointsFromPath(polygonToAdd.path);
                that.fire(that.events.polygonBeforeAdded, points);
            }

            function markPolygonAsDitryByPath(path) {
                var polygon = findPolygonByPath.call(that, path);
                if (polygon && !polygon.isDirty) {
                    polygon.markAsDirty();
                }
            }

            function updatePolygonEnd(path) {
                updatePolygonByPath(path);
            }

            function updatePolygonByPath(path) {
                var polygon = findPolygonByPath.call(that, path);
                if (polygon && polygon.isDirty) {
                    polygon.markAsClean();
                    var polygonViewModel = findPolygonViewModelById.call(that, polygon.id);
                    if (polygonViewModel) {
                        var points = getPointsFromPath(path);
                        that.fire(that.events.polygonUpdated, polygonViewModel, points);
                    } else {
                        throw 'Polygon ViewModel in null';
                    }
                }
            }

            function removePolygonByPath(path) {
                var polygon = findPolygonByPath.call(that, path);
                if (polygon) {
                    var polygonViewModel = findPolygonViewModelById.call(that, polygon.id);
                    that._editor.polygons.splice(that._editor.polygons.indexOf(polygon), 1);
                    if (polygonViewModel) {
                        that.fire(that.events.polygonDeleted, polygonViewModel);
                    }
                    polygon.removePath();
                } else {
                    path.remove();
                }

            }

            function pathSizeIsValid(path) {
                return path.bounds.width > that._editor.minSize && path.bounds.height > that._editor.minSize;
            }

            function generateCanvas() {
                var canvas = document.createElement('canvas');
                canvas.className = "hotspot-area";
                return canvas;
            }
        }

        function deselectAllElements() {
            this._paper.project.activeLayer.selected = false;
            this._editor.selectedPath = null;
            this._editor.selectedSegment = null;
            this._paper.view.draw();
        }

        function getPointsFromPath(path) {
            return _.map(path.segments, function (segment) {
                var point = segment.point;
                return { x: Math.round(point.x), y: Math.round(point.y) };
            });
        }

        function findPolygonByPath(path) {
            return _.find(this._editor.polygons, function (polygon) {
                return polygon.path === path;
            });
        }

        function findPolygonById(id) {
            return _.find(this._editor.polygons, function (polygon) {
                return polygon.id === id;
            });
        }

        function findPolygonViewModelById(id) {
            return _.find(this.polygons(), function (polygonViewModel) {
                return polygonViewModel.id === id;
            });
        }

        function updateCanvasSize(width, height) {
            var $canvas = $(this.canvas);
            if ($canvas[0].width != width || $canvas[0].height != height) {
                this._paper.view.viewSize = new this._paper.Size(width, height);
                this._paper.view.draw();
            }
        }

        function updatePolygons(polygons) {
            var that = this;
            that.polygons = polygons;
            paper = that._paper.view._scope;
            
            _.each(polygons(), function (polygon) {
                var polygonInEditor = _.find(that._editor.polygons, function (polygonShape) { return polygon.id === polygonShape.id; });
                if (polygonInEditor) {
                    polygonInEditor.updatePoints(polygon.points(), polygon.onClick);
                } else {
                    that._editor.polygons.push(new that._PolygonShape(polygon.id, polygon.points(), polygon.onClick));
                }
            });
            that._editor.polygons = _.filter(that._editor.polygons, function (polygonShape) {
                if (polygonShape.id != null && _.find(polygons(), function (polygon) { return polygon.id === polygonShape.id; })) {
                    return true;
                } else {
                    polygonShape.removePath();
                    return false;
                }
            });
            that._paper.view.draw();
        }

    }
);
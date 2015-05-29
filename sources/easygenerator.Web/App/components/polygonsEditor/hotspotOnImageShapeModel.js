define(['components/polygonsEditor/polygonShape'], function (PolygonShape) {
    'use strict';

    var informationIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJDQUU2NzIwRTc2MjExRTRCMUY5QUU4MjNFMzcyOUU1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJDQUU2NzIxRTc2MjExRTRCMUY5QUU4MjNFMzcyOUU1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkNBRTY3MUVFNzYyMTFFNEIxRjlBRTgyM0UzNzI5RTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkNBRTY3MUZFNzYyMTFFNEIxRjlBRTgyM0UzNzI5RTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6BgWwaAAAHd0lEQVR42sxZ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',
        settings = {
            minRasterWidth: 0,
            minRasterHeight: 0
        };


    var HotspotOnImageShapeModel = function (id, points, onClick) {
        PolygonShape.call(this, id, points, false);
        var that = this,
            mouseDownPoint = null;
        this.group = null;
        this.onClick = null;
        this.raster = null;
        this.removePath = function () {
            if (that.raster) {
                that.raster.remove();
            }
            if (that.group) {
                that.group.removeChildren();
                that.group.remove();
            } else if(that.path) {
                that.path.remove();
            }
        };
        this.updatePoints = function (data, onClick) {
            if (data) {
                var selected = false;
                if (that.group) {
                    that.group.removeChildren();
                    that.group.remove();
                }

                if (that.path) {
                    selected = that.path.selected;
                    that.path.remove();
                }
                if (data instanceof paper.Rectangle) {
                    that.path = new paper.Path.Rectangle(data);
                } else if (data instanceof Array) {
                    that.path = new paper.Path({
                        segments: data,
                        closed: true
                    });
                }
                that.path.fillColor = that.settings.fillColor;
                that.path.fillColor.alpha = 0.6;
                that.path.strokeColor = that.settings.strokeColor;
                that.path.strokeColor.alpha = 0.7;
                that.path.selectedColor = that.settings.selectedColor;
                that.path.selected = selected;
                that.onClick = onClick;
                if (canDrawRaster()) {
                    var centerPoint = getShapeCenter(that.path);
                    that.raster = new paper.Raster(informationIcon, centerPoint);
                    settings.minRasterHeight = that.raster.height + 5;
                    settings.minRasterWidth = that.raster.width + 5;
                    that.group = new paper.Group([that.path, that.raster]);

                    if (that.group) {
                        that.group.on('mousedown', onMouseDown);
                        that.group.on('mouseup', onMouseUp);
                    }
                } else {
                    that.path.onMouseDown = onMouseDown;
                    that.path.onMouseUp = onMouseUp;
                }
            }
        };

        this.updatePoints(points, onClick);

        function onMouseDown(evt) {
            mouseDownPoint = evt.point;
        }

        function onMouseUp(evt) {
            if (mouseDownPoint && mouseDownPoint.x === evt.point.x && mouseDownPoint.y === evt.point.y) {
                that.onClick(evt, points);
            }
        }

        function canDrawRaster() {
            return that.path.bounds.width > settings.minRasterWidth && that.path.bounds.height > settings.minRasterHeight;
        }
    };

    return HotspotOnImageShapeModel;

    function getShapeCenter(path) {
        var position = path.getPosition();
        return new paper.Point(position.x, position.y);
    }

});
define(['components/polygonsEditor/polygonShape'], function (PolygonShape) {
    'use strict';

    var informationIcon = 'Content/images/hotspot-on-image-info-icon.png',
        settings = {
            minRasterWidth: 45,
            minRasterHeight: 45,
        };

    var HotspotOnImageShapeModel = function (id, points, onClick) {
        PolygonShape.call(this, id, points, false);
        var that = this,
            mouseDownPoint = null;
        this.group = null;
        this.onClick = onClick;
        this.raster = null;
        this.removePath = function() {
            if (that.group) {
                that.group.removeChildren();
                that.group.remove();
            } else if(that.path) {
                that.path.remove();
            }
        };
        this.updatePoints = function (data) {
            if (data) {
                var selected = false;
                if (that.group) {
                    that.group.remove();
                }

                if (that.raster) {
                    that.raster.remove();
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
                if (canDrawRaster()) {
                    var centerPoint = getShapeCenter(that.path);
                    that.raster = new paper.Raster(informationIcon, centerPoint);
                    that.group = new paper.Group([that.path, that.raster]);
                }
                if (that.group) {
                    that.group.onMouseDown = onMouseDown;
                    that.group.onMouseUp = onMouseUp;
                }
                that.path.onMouseDown = onMouseDown;
                that.path.onMouseUp = onMouseUp;
            }
        };

        this.updatePoints(points);

        function onMouseDown(evt) {
            mouseDownPoint = evt.point;
        }

        function onMouseUp(evt) {
            if (mouseDownPoint && mouseDownPoint.x === evt.point.x && mouseDownPoint.y === evt.point.y) {
                onClick.call(that, evt);
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
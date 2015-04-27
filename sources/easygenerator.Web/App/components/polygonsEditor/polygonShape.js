define([],
    function () {
        var settings = {
            fillColor: '#66b963',
            strokeColor: '#559b53',
            selectedColor: 'green'
        };

        function PolygonShape(id, points) {
            var that = this;
            this.id = id;
            this.path = null;
            this.isDitry = false;
            this.markAsDirty = function () {
                that.isDitry = true;
            };
            this.markAsClean = function () {
                that.isDitry = false;
            };
            this.updatePoints = function (data) {
                if (data) {
                    var selected = false;
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
                    that.path.fillColor = settings.fillColor;
                    that.path.fillColor.alpha = 0.6;
                    that.path.strokeColor = settings.strokeColor;
                    that.path.strokeColor.alpha = 0.7;
                    that.path.selectedColor = settings.selectedColor;
                    that.path.selected = selected;
                }
            };
            this.updatePoints(points);
        }

        return PolygonShape;
    }
);
define([],
    function () {
        var settings = {
            fillColor: '#66b963',
            strokeColor: '#559b53',
            selectedColor: 'green'
        };

        function PolygonShape(id, points, needUpdatePoints) {
            var that = this;
            this.id = id;
            this.path = null;
            this.isDirty = false;
            this.isUpdatePoints = needUpdatePoints || true;
            this.settings = settings;
            this.removePath = function() {
                if (that.path) {
                    that.path.remove();
                }
            }
            this.markAsDirty = function () {
                that.isDirty = true;
            };
            this.markAsClean = function () {
                that.isDirty = false;
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
                    that.path.fillColor = that.settings.fillColor;
                    that.path.fillColor.alpha = 0.6;
                    that.path.strokeColor = that.settings.strokeColor;
                    that.path.strokeColor.alpha = 0.7;
                    that.path.selectedColor = that.settings.selectedColor;
                    that.path.selected = selected;
                }
            };

            if (this.isUpdatePoints) {
                this.updatePoints(points);
            }
        }

        return PolygonShape;
    }
);
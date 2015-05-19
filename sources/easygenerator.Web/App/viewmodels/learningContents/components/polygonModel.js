define(['durandal/system', 'widgets/hotSpotOnImageTextEditor/viewmodel'],
    function (system, hotSpotOnImageTextEditor) {
        var PolygonModel = function (id, points, text) {
            var that = this;
            that.id = ko.observable(id || system.guid());
            that.points = ko.observable(points);
            that.text = text || '';
            that.onClick = function (evt) {
                var minMaxCoords = getMinMaxCoords(that.points());
                var element = evt.target.getView().getElement();
                var position = element.getBoundingClientRect();
                var top = position.top +  minMaxCoords.minY + (minMaxCoords.maxY - minMaxCoords.minY) / 2;
                var left = position.left + minMaxCoords.maxX;
                hotSpotOnImageTextEditor.show(that.text, top, left, function (value) {
                    that.text = value;
                });
            };
        };

        return PolygonModel;

        function getMinMaxCoords(points) {
            var minX = _.min(points, function (point) {
                return point.x;
            }),
                minY = _.min(points, function (point) {
                    return point.y;
                }),
                maxX = _.max(points, function (point) {
                    return point.x;
                }),
                maxY = _.max(points, function (point) {
                    return point.y;
                });

            return {
                minX: minX.x,
                minY: minY.y,
                maxX: maxX.x,
                maxY: maxY.y
            };
        }
    }
);
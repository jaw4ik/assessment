define(['durandal/system', 'widgets/hotSpotOnImageTextEditor/viewmodel'],
    function (system, hotSpotOnImageTextEditor) {
        var PolygonModel = function (id, points, text, updateCallback) {
            var that = this;
            that.id = id || system.guid();
            that.points = ko.observable(points);
            that.text = text || '';
            that.onClick = function(evt) {
                var minMaxCoords = getMinMaxCoords(that.points()),
                    element = evt.target.getView().getElement(),
                    position = element.getBoundingClientRect(),
                    top = window.scrollY + position.top + minMaxCoords.minY + (minMaxCoords.maxY - minMaxCoords.minY) / 2,
                    left = position.left + minMaxCoords.maxX;

                hotSpotOnImageTextEditor.show(that.text, element, that.points(), function (value) {
                    that.text = value;
                    updateCallback(that.id, that.text, that.points());
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
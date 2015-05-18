define(['durandal/system', 'widgets/hotSpotOnImageTextEditor/viewmodel'],
    function (system, hotSpotOnImageTextEditor) {
        var PolygonModel = function (id, points, text) {
            var that = this;
            this.id = id || system.guid();
            this.points = ko.observable(points);
            this.text = text || '';
            this.onClick = function () {
                hotSpotOnImageTextEditor.show(that.text, 200, 200, function (value) {
                    that.text = value;
                });
            };
        };

        return PolygonModel;
    }
);
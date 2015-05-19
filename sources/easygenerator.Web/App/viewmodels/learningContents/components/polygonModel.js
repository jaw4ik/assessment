define(['durandal/system', 'widgets/hotSpotOnImageTextEditor/viewmodel'],
    function (system, hotSpotOnImageTextEditor) {
        var PolygonModel = function (id, points, text) {
            var that = this;
            this.id = id || system.guid();
            this.points = ko.observable(points);
            this.text = text || '';
            this.onClick = function (evt) {
                var view = evt.target.getView();
                debugger;
                hotSpotOnImageTextEditor.show(that.text, evt.target.getNearestPoint().y, evt.target.getNearestPoint().x, function (value) {
                    that.text = value;
                });
            };
        };

        return PolygonModel;
    }
);
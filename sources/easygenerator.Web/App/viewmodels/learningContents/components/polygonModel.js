define(['durandal/system', 'widgets/hotSpotOnImageTextEditor/viewmodel'],
    function (system, hotSpotOnImageTextEditor) {
        var PolygonModel = function (id, points, text, updateCallback) {
            var that = this;
            that.id = id || system.guid();
            that.points = ko.observable(points);
            that.text = text || '';
            that.onClick = function (evt) {
                var element;
                if (evt instanceof paper.MouseEvent) {
                    element = evt.target.getView().getElement();
                } else {
                    element = evt;
                }

                hotSpotOnImageTextEditor.show(that.text, element, that.points(), function (value) {
                    that.text = value;
                    updateCallback(that.id, that.text, that.points());
                });
            };
        }; 

        return PolygonModel;
    }
);
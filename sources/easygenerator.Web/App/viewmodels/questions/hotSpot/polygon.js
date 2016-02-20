define(['./commands/updatePolygon', 'eventTracker', 'notify'],
    function (updatePolygon, eventTracker, notify) {

        return function (id, points) {
            var
                that = this,
                self = {
                    events: {
                        updateRectangle: 'Edit hotspot rectangle'
                    }
                }
            ;

            this.id = id;
            this.isDeleted = false;
            this.points = ko.observable(points);
            this.isEditing = ko.observable(false);

            this.startEditing = function () {
                that.isEditing(true);
            };

            this.endEditing = function (points) {
                that.isEditing(false);

                updatePolygon.execute(that.id, points).then(function () {
                    that.points(points);

                    notify.saved();
                    eventTracker.publish(self.events.updateRectangle);
                });
            }

            this.fitBounds = function (width, height) {
              
            }
        };
    })
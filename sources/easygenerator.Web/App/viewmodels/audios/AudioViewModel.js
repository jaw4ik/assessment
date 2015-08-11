define(['constants'], function (constants) {

    return function AudioViewModel(item) {
        var that = this;
        that.id = item.id;
        that.title = item.title;
        that.vimeoId = ko.observable(item.vimeoId);
        that.progress = ko.observable(item.progress || 0);
        that.status = ko.observable(item.status || constants.storage.audio.statuses.loaded);

        var duration = ko.observable(item.duration);

        that.duration = ko.computed({
            read: function () {
                var d = duration();
                if (d) {
                    var minutes = Math.floor(d / 60);
                    var seconds = d - (minutes * 60);

                    if (minutes < 10) { minutes = "0" + minutes; }
                    if (seconds < 10) { seconds = "0" + seconds; }

                    return minutes + ':' + seconds;
                }
                return '--:--';
            },
            write: function (value) {
                duration(value);
            }
        });
    };

})
define(['constants'], function (constants) {

    return function AudioViewModel(item) {
        var that = this;
        that.id = item.id;
        that.title = item.title;
        that.vimeoId = ko.observable(item.vimeoId);
        that.progress = ko.observable(item.progress || 0);
        that.status = ko.observable(item.status || constants.storage.audio.statuses.loaded);
        that.time = ko.observable(getTimeString(item.duration || 0));
    };

    function getTimeString(number) {
        var minutes = Math.floor(number / 60);
        var seconds = number - (minutes * 60);

        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        return minutes + ':' + seconds;
    }

})
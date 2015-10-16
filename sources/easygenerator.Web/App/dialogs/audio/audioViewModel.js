define([], function () {

    return function AudioViewModel(entity) {
        var that = this;

        that.title = entity.title;
        that.vimeoId = entity.vimeoId;
    };
})
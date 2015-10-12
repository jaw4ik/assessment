(function (app) {
    var playerViewModel = app.playerViewModel,
        qualities = app.vimeoFileQualities,
        interval = app.playerUpdateInterval,
        getSources = function () {
            return $.ajax({ url: app.sourcesUrl + app.mediaId, cache: false }).done(onSuccess).fail(onFail);
        }

    getSources();
    
    function onFail() {
        playerViewModel.processing(false);
        return setTimeout(getSources, interval);
    }

    function onSuccess(files) {
        if (!files || !files.length) {
            return onFail();
        }
        var fileLinks = {};
        files.forEach(function (file) {
            if (file && file.link_secure && file.quality) {
                fileLinks[file.quality] = file.link_secure;
            }
        });
        playerViewModel.sources([]);
        qualities.forEach(function (quality) {
            if (fileLinks[quality]) {
                playerViewModel.sources.push({ quality: quality, link: fileLinks[quality] });
            }
        });
        var source = playerViewModel.sources()[0];
        if (!source || !source.link) {
            return onFail();
        }
        playerViewModel.currentSource(source.link);
        playerViewModel.currentQuality(source.quality);
        playerViewModel.processing(false);
        return videojs('easy-player');
    }

})(window.app);
(function (app) {
    var playerViewModel = app.playerViewModel,
        video = app.video,
        qualities = app.vimeoFileQualities,
        interval = app.playerUpdateInterval,
        volumeKey = app.volumeKey,
        storageProvider = app.storageProvider,
        cssInjector = app.cssInjector,
        getSources = function () {
            return $.ajax({ url: app.sourcesUrl + app.mediaId, cache: false }).done(onSuccess).fail(onFail);
        },

        playerId = 'easy-player',
        videoClass = 'vjs-tech',
        playingClass = 'playing',
        notSupportedDeviceClass = 'vjs-using-native-controls';
    
    getSources();
    
    if (app.stylevariables && typeof app.stylevariables === "object") {
        app.cssInjector.applyStyles(app.stylevariables);
    }

    function volumeHandler(e) {
        var player = e.target.player;
        var volume = player.volume();
        var muted = player.muted();
        if (volume === 0) {
            volume = 1;
            muted = true;
            var volumeSettings = storageProvider.get(volumeKey);
            if (volumeSettings && volumeSettings.volume) {
                volume = volumeSettings.volume;
            }
        }
        storageProvider.set(volumeKey, { volume: volume, muted: muted });
    }
    
    function handleVolumeChanges(player) {
        if (!storageProvider || !player) {
            return;
        }
        var volumeSettings = storageProvider.get(volumeKey);
        if (volumeSettings) {
            player.volume(volumeSettings.volume);
            player.muted(volumeSettings.muted);
        }
        player.on('volumechange', volumeHandler);
    }
    
    function handleNotSupportedDevices() {
        if (!document.getElementsByClassName(notSupportedDeviceClass).length) {
            return;
        }
        
        var $player = $('#' + playerId),
            $video = $('.' + videoClass),
            video = $video.get(0);
        if (video.hasAttribute('autoplay')) {
            $player.addClass(playingClass);
        }
        
        $player.on('click', function () {
            if (video.paused) {
                video.play();
                $player.addClass(playingClass);
                return;
            }
            video.pause();
            $player.removeClass(playingClass);
            
        });
    }
    
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
        
        var player = videojs(playerId);
        if (!video) {
            handleNotSupportedDevices();
        }
        handleVolumeChanges(player);
        return player;
    }

})(window.app);
(function (app) {
    var playerViewModel = app.playerViewModel,
        statuses = playerViewModel.statuses,
        video = app.video,
        interval = app.playerUpdateInterval,
        volumeKey = app.volumeKey,
        storageProvider = app.storageProvider,
        cssInjector = app.cssInjector,
        getSources = function () {
            return $.get('/sources?mediaId=' + app.mediaId).done(onSuccess).fail(onFail);
        },

        playerId = 'easy-player',
        videoClass = 'vjs-tech',
        playingClass = 'playing',
        notSupportedDeviceClass = 'vjs-using-native-controls';

    playerViewModel.status(statuses.loading);
    getSources();

    if (app.styleVariables && typeof app.styleVariables === "object") {
        app.cssInjector.applyStyles(app.styleVariables);
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

    function onSuccess(sources) {
        playerViewModel.status(statuses.processing);
        
        if (sources && sources.length) {
            processSources(sources);
            return;
        }

        setTimeout(getSources, interval);
    }

    function onFail(error) {
        if (error.status === 404 || error.status === 400) {
            playerViewModel.status(statuses.notFound);
            return;
        }
        
        playerViewModel.status(statuses.processing);
        setTimeout(getSources, interval);
    }

    function processSources(sources) {
        playerViewModel.sources(sources.sort(function (a, b) {
            return a.quality < b.quality ? 1 : -1;
        }));
        var source = playerViewModel.sources()[0];
        if (!source || !source.url) {
            return onFail({ status: 500 });
        }
        playerViewModel.currentSource(source.url);
        playerViewModel.currentQuality(source.quality);
        playerViewModel.status(statuses.available);

        var player = videojs(playerId);
        if (!video) {
            handleNotSupportedDevices();
        }
        handleVolumeChanges(player);
    }

})(window.app);
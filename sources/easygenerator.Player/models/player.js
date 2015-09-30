var modes = {
	audio: 0,
	video: 1
}

var model = function Player(spec) {
	this.mode = parseInt(spec.mode) === modes.video ? modes.video : modes.audio;
    this.source = spec.source && typeof spec.source === "string" ? spec.source : null;
    this.sourceId = spec.source_id || null;
    this.poster = spec.poster && typeof spec.poster === "string" ? spec.poster : null;
    this.autoplay = parseInt(spec.autoplay) === 1;
	this.css = spec.css && typeof spec.css === "string" ? spec.css : null;
    this.children = {
        playToggle: !(parseInt(spec.play_toggle) === 0),
        currentTimeDisplay: !(parseInt(spec.current_time_display) === 0),
        timeDivider: !(parseInt(spec.time_divider) === 0),
        durationDisplay: !(parseInt(spec.duration_display) === 0),
        remainingTimeDisplay: !(parseInt(spec.remaining_time_display) === 0),
        liveDisplay: parseInt(spec.live_display) === 1,
        progressControl: !(parseInt(spec.progress_control) === 0),
        fullscreenToggle: parseInt(spec.fullscreen_toggle) === 1,
        volumeControl: !(parseInt(spec.volume_control) === 0),
        muteToggle: !(parseInt(spec.mute_toggle) === 0),
        playbackRateMenuButton: !(parseInt(spec.playback_rate_menu_button) === 0),
        subtitlesButton: !(parseInt(spec.subtitles_button) === 0),
        captionsButton: !(parseInt(spec.captions_button) === 0),
        chaptersButton: !(parseInt(spec.chapters_button) === 0)
    };
}

module.exports = model;
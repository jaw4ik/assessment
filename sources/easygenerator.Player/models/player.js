var model = function Player(spec) {
	this.video = parseInt(spec.video) === 1;
    this.source = spec.source && typeof spec.source === "string" ? spec.source : null;
    this.poster = spec.poster && typeof spec.poster === "string" ? spec.poster : null;
    this.autoplay = parseInt(spec.autoplay) === 1;
    this.loop = parseInt(spec.loop) === 1;
    this.css = spec.css && typeof spec.css === "string" ? spec.css : null;
    this.background = parseInt(spec.background) === 1;
    this.styleVariables = spec.stylevariables && typeof spec.stylevariables === "string" ?  spec.stylevariables : 0;
    this.controlBar = {
        playToggle: !(parseInt(spec.play_toggle) === 0),
        volumeMenuButton: !(parseInt(spec.volume_menu_button) === 0),
        currentTimeDisplay: !(parseInt(spec.current_time_display) === 0),
        timeDivider: !(parseInt(spec.time_divider) === 0),
        durationDisplay: !(parseInt(spec.duration_display) === 0),
        progressControl: !(parseInt(spec.progress_control) === 0),
        liveDisplay: parseInt(spec.live_display) === 1,
        remainingTimeDisplay: !(parseInt(spec.remaining_time_display) === 0),
        customControlSpacer: parseInt(spec.custom_control_spacer) === 1,
        playbackRateMenuButton: !(parseInt(spec.playback_rate_menu_button) === 0),
        chaptersButton: !(parseInt(spec.chapters_button) === 0),
        subtitlesButton: !(parseInt(spec.subtitles_button) === 0),
        captionsButton: !(parseInt(spec.captions_button) === 0),
        fullscreenToggle: parseInt(spec.fullscreen_toggle) === 1
    };
}

module.exports = model;
var 
    path = require('path'),
    
    _ = require('lodash'),
    Q = require('q'),
    ffmpeg = require('fluent-ffmpeg'),
    
    config = require('./config');

ffmpeg.setFfmpegPath(config.FFMPEG_PATH);
ffmpeg.setFfprobePath(config.FFMPEG_PROBE_PATH);


function run(input, outputDirectory, options) {
    var dfd = Q.defer();
    
    options = options || {};
    
    _.defaults(options, {
        name: config.OUTPUT_FILE_NAME,
        format: config.OUTPUT_FILE_FORMAT,
        image: config.INPUT_IMAGE,
        videoCodec: config.FFMPEG_VIDEO_CODEC,
        audioCodec: config.FFMPEG_AUDIO_CODEC
    });
    
    var ouputFile = path.join(outputDirectory, options.name + '.' + options.format);

    ffmpeg()
        .format(options.format)
        .input(input)
        .input(options.image)
        .addInputOption('-loop 1')
        .audioCodec(options.audioCodec)
        .videoCodec(options.videoCodec)
        .addOutputOption('-shortest')
        .addOption('-strict', '-1')
        .output(ouputFile)
        .on('end', function() {
            ffmpeg.ffprobe(ouputFile, function(err, metadata) {
                if (err) {
                    dfd.reject(err.message);
                    return;
                }
                dfd.resolve(metadata.format);
            });
        })
        .on('error', function(err, stdout, stderr) {
            dfd.reject(err.message);
        }).run();
    
    return dfd.promise;
}

module.exports = {
    run: run
};
var 
    path = require('path'),
    
    _ = require('lodash'),
    Q = require('q'),
    ffmpeg = require('fluent-ffmpeg'),
    
    config = require('./config');

ffmpeg.setFfmpegPath(config.FFMPEG_PATH);
ffmpeg.setFfprobePath(config.FFMPEG_PROBE_PATH);


function run(input, output, options) {
    var dfd = Q.defer();
    
    options = options || {};
    
    _.defaults(options, {
        name: 'output',
        format: 'mp4',
        image: 'D:\\Development\\ffmpeg\\image.jpg',
        videoCodec: 'mpeg4',
        audioCodec: 'libmp3lame'
    });

    ffmpeg()
        .format(options.format)
        .input(input)
        .input(options.image)
        .videoCodec(options.videoCodec)
        .audioCodec(options.audioCodec)
        .output(path.join(output, options.name + '.' + options.format))
        .on('end', function() {
            dfd.resolve();
        })
        .on('error', function(err, stdout, stderr) {
            dfd.reject(err.message);
        }).run();
    
    return dfd.promise;
}

module.exports = {
    run: run
};
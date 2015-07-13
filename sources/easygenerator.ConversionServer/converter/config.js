var path = require('path');


module.exports = {
    FFMPEG_PATH: 'D:\\bin\\ffmpeg.exe',
    FFMPEG_PROBE_PATH: 'D:\\bin\\ffprobe.exe',
    
    INPUT_IMAGE: path.join(__dirname, '..', 'audio_image.jpg'),
    
    OUTPUT_FILE_NAME: 'output',
    OUTPUT_FILE_FORMAT: 'mp4',
    
    FFMPEG_VIDEO_CODEC: 'mpeg4',
    FFMPEG_AUDIO_CODEC: 'libmp3lame'
};
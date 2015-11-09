var gulp = require('gulp'),
    args = require('yargs').argv;

var $ = require('gulp-load-plugins')({
    lazy: true
});

gulp.task('storage-iis-express', $.shell.task([
    '"%ProgramFiles%\\IIS Express\\iisexpress" /path:"' + (args.path || 'D:\\Development\\storage\\sources\\easygenerator.StorageServer') + '" /port:888 /systray:true'
]));
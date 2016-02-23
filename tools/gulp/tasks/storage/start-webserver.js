import gulp from 'gulp';
import yargs from 'yargs';
import gulpLoadPlugins from 'gulp-load-plugins';

var args = yargs.argv;

var $ = gulpLoadPlugins({
    lazy: true
});

gulp.task('storage-iis-express', $.shell.task([
    '"%ProgramFiles%\\IIS Express\\iisexpress" /path:"' + (args.path || 'D:\\Development\\easygenerator\\sources\\easygenerator.StorageServer') + '" /port:888 /systray:true'
]));
import gulp from 'gulp';
import yargs from 'yargs';
import gulpLoadPlugins from 'gulp-load-plugins';

var args = yargs.argv;
var $ = gulpLoadPlugins({
    lazy: true
});

gulp.task('publication-iis-express', $.shell.task([
    '"%ProgramFiles%\\IIS Express\\iisexpress" /path:"' + (args.path || 'D:\\Development\\easygenerator\\sources\\easygenerator.PublicationServer.Web') + '" /port:777 /systray:true'
]));
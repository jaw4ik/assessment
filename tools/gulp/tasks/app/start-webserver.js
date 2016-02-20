import gulp from 'gulp';
import yargs from 'yargs';
import buildUtilsModule from '../build-utils';
import gulpLoadPlugins from 'gulp-load-plugins';

var args = yargs.argv;
var buildUtils = buildUtilsModule();
var $ = gulpLoadPlugins({
    lazy: true
});

gulp.task('web-build', ['styles'], function () {
    return buildUtils.buildProjects(['./sources/easygenerator.Web/easygenerator.Web.csproj']);
});

gulp.task('web-iis-express', ['web-build'], $.shell.task([
    '"%ProgramFiles%\\IIS Express\\iisexpress" /path:"' + (args.path || 'D:\\Development\\easygenerator\\sources\\easygenerator.Web') + '" /port:666 /systray:true'
]));
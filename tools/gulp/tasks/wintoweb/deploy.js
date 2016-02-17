import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import yargs from 'yargs';
import buildUtilsModule from '../build-utils';
import config from '../../config';

const buildUtils = buildUtilsModule();
const args = yargs.argv;
const $ = gulpLoadPlugins({
    lazy: true
});


var basePath = './sources/easygenerator.WinToWebConverter/';

var outputWinToWeb = args.outputWinToWeb || 'D:/Applications/WinToWebConverter',
    instance = args.instance || 'Release';
   
gulp.task('clean-wintoweb', callback => {
    del([outputWinToWeb], { force: true }, callback); 
});

gulp.task('copy-wintoweb-converter', ['clean-wintoweb'], () => {
    let files = [
        `${basePath}www.js`,
        `${basePath}Web.config`,
        `${basePath}server.js`,
        `${basePath}package.json`,
        `${basePath}iisnode.yml`,
        `${basePath}converter/**/*.*`,
        `${basePath}controllers/*.*`,
        `${basePath}components/*.*`
    ];
    
    return gulp.src(files, { base: basePath })
        .pipe(gulp.dest(outputWinToWeb));
});

gulp.task('copy-wintoweb-config-transform', ['clean-wintoweb'], function () {
    return gulp.src('./tools/WinToWebConverterTransform/' + instance + '.transform.json')
        .pipe($.rename('config.json'))
        .pipe(gulp.dest(outputWinToWeb))
});

gulp.task('deploy-wintoweb', ['copy-wintoweb-converter', 'copy-wintoweb-config-transform'], 
    () => gulp.src([outputWinToWeb + '/package.json']).pipe($.install({ production: true })));
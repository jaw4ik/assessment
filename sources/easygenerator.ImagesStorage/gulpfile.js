'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var argv = require('yargs').argv;

const dest = '.output';
const archivesDest = '.archives';
const configsDir = 'deployment';
const filesToCopy = [
    './**',
    '!deployment/**', '!deployment',
    '!node_modules/**', '!node_modules',
    '!.vscode', '!.gitignore', '!*.bat', '!*.md', '!gulpfile.js', '!*.njsproj', '!jsconfig.json'
];
var instance = argv.instance || 'staging';
var getZipFileNameWithDate = (name) => {
    let date = new Date();
    return `${name}.${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}.zip`;
};

gulp.task('default', ['clean', 'copy-files', 'copy-configs', 'npm-install', 'zip'], () => gulp.start('clean'));

gulp.task('clean', () => del(dest));
gulp.task('clean-archives', () => del(archivesDest));
gulp.task('npm-install', ['copy-files'], () => gulp.src(dest + '/package.json').pipe($.install({
    production: true
})));
gulp.task('copy-files', ['clean'], () => gulp.src(filesToCopy).pipe(gulp.dest(dest)));
gulp.task('zip', ['npm-install', 'copy-configs'], () => gulp.src(dest + '/**').pipe($.zip(getZipFileNameWithDate('image-storage'))).pipe(gulp.dest(archivesDest)));
gulp.task('copy-configs', ['clean', 'copy-files'], () => gulp.src(`${configsDir}/${instance}/**`).pipe(gulp.dest(dest, {
    overwrite: true
})));
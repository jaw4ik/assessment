import gulp from 'gulp';
import del from 'del';
import fs from 'fs';
import yargs from 'yargs';
import runSequence from 'run-sequence';
import buildUtilsModule from '../build-utils';
import has from 'gulp-has';
import uglify from 'gulp-uglify';
import xmlpoke from 'xmlpoke';

var args = yargs.argv;
var buildUtils = buildUtilsModule();

var outputDirectory = args.output || 'D:/Applications/easygenerator',
    instance = args.instance || 'Release',
    version = typeof args.version === 'string' && args.version !== '' ? args.version : '1.0.0',    
    createTags = Boolean(args.createTags),
    surveyOriginUrl = typeof args.surveyOriginUrl === 'string' && args.surveyOriginUrl !== '' ? args.surveyOriginUrl : '',
    surveyPageUrl = typeof args.surveyPageUrl === 'string' && args.surveyPageUrl !== '' ? args.surveyPageUrl : '',
    surveyVersion = (typeof args.surveyVersion === 'string' && args.surveyVersion !== '') || (typeof args.surveyVersion === 'number' && args.surveyVersion >= 0) ? args.surveyVersion : '1',
    surveyDaysUntilShowUp = (typeof args.surveyDaysUntilShowUp === 'string' && args.surveyDaysUntilShowUp !== '') || (typeof args.surveyDaysUntilShowUp === 'number' && args.surveyDaysUntilShowUp >= 0) ? args.surveyDaysUntilShowUp : '1';

var samlCertsFolderName = 'EgSamlIdPCertificates';
var testResultsDirectory = './TestResults';

gulp.task('build-main-project', function () {
    return buildUtils.buildProjects(['./sources/easygenerator.Web/easygenerator.Web.csproj'], outputDirectory + '/bin', outputDirectory);
});

gulp.task('build-web-config', function () {
    return buildUtils.transformWebConfig('./tools/WebConfigTransform/Transform.proj', './tools/WebConfigTransform', instance);
});

gulp.task('build-unit-tests', function () {
    return buildUtils.buildProjects([
        './sources/easygenerator.DomainModel.Tests/easygenerator.DomainModel.Tests.csproj',
        './sources/easygenerator.DataAccess.Tests/easygenerator.DataAccess.Tests.csproj',
        './sources/easygenerator.Infrastructure.Tests/easygenerator.Infrastructure.Tests.csproj',
        './sources/easygenerator.Web.Tests/easygenerator.Web.Tests.csproj'
    ]);
});

gulp.task('build', function (cb) {
    runSequence('clean', 'build-main-project', 'build-system', 'build-unit-tests', 'build-web-config', 'styles', cb)
});

gulp.task('deploy-download-folder', function (cb) {
    buildUtils.createDirectory(cb, outputDirectory + '/Download');
});

gulp.task('deploy-css', function () {
    return gulp.src('./sources/easygenerator.Web/Content/**/*.css')
        .pipe(gulp.dest(outputDirectory + '/Content'));
});

gulp.task('remove-app-sources', function () {
    return del(outputDirectory + '/app', { force: true });
});

gulp.task('deploy-main-app', function () {
    gulp.src('./sources/easygenerator.Web/app/localization/lang/**')
        .pipe(gulp.dest(outputDirectory + '/app/localization/lang/'));
    
	gulp.src('./sources/easygenerator.Web/app/components/htmlEditor/lang/**')
        .pipe(gulp.dest(outputDirectory + '/app/components/htmlEditor/lang/'));
	
    return gulp.src('./sources/easygenerator.Web/app/main-built.js')
		.pipe(has({
			'release': true
        }))
		.pipe(uglify())
        .pipe(gulp.dest(outputDirectory + '/app'));
});

gulp.task('deploy-vendor', function () {
    return gulp.src('./sources/easygenerator.Web/Scripts/vendor/**/*')
        .pipe(gulp.dest(outputDirectory + '/Scripts/vendor'));
});

gulp.task('deploy-web-config', function () {
    return buildUtils.moveWebConfig('./tools/WebConfigTransform/' + instance + '.config', outputDirectory);
});

gulp.task('include-saml-certificates', function(cb) {
	fs.stat(`./tools/${samlCertsFolderName}/${instance}`, function(err){
		if(err != null){
			cb();
			return;
		}
		del([`${outputDirectory}/SAML/IdentityProvider/Certificates/*`], { force: true }).then(function(){
			gulp.src(`./tools/${samlCertsFolderName}/${instance}/*`)
				.pipe(gulp.dest(`${outputDirectory}/SAML/IdentityProvider/Certificates`));
			cb();
		});
	});
});

gulp.task('remove-extra-files', function () {
    return del([outputDirectory + '/*debug.config',
        outputDirectory + '/*release.config',
        outputDirectory + '/packages.config',
        outputDirectory + '/bin/*.config',
        outputDirectory + '/bin/*.xml',
        outputDirectory + '/**/*.pdb',
        outputDirectory + '/**/*spec.js',
        outputDirectory + '/apple-touch-icon*',
        outputDirectory + '/Scripts/*.map',
        outputDirectory + '/humans.txt',
        outputDirectory + '/Content/**/*.less',
        outputDirectory + '/Scripts/jasmine',
        'tools/WebConfigTransform/' + instance + '.config'], { force: true });
});

gulp.task('add-version', function (cb) {
    xmlpoke(outputDirectory + '/Web.config', function (webConfig) {
        webConfig.withBasePath('configuration')
            .setOrAdd("appSettings/add[@key='version']/@value", version);
    });
    cb();
});

gulp.task('add-survey-popup-settings', function (cb) {
    xmlpoke(outputDirectory + '/Web.config', function (webConfig) {
        webConfig.withBasePath('configuration')
            .setOrAdd('surveyPopup/@originUrl', surveyOriginUrl)
            .setOrAdd('surveyPopup/@pageUrl', surveyPageUrl)
            .setOrAdd('surveyPopup/@version', surveyVersion)
            .setOrAdd('surveyPopup/@numberOfDaysUntilShowUp', surveyDaysUntilShowUp);
    });
    cb();
});

gulp.task('clean', function () {
    return del([outputDirectory,
		 testResultsDirectory], { force: true });
});

gulp.task('deploy', function (cb) {
    runSequence('build',
        'run-unit-tests',
        'deploy-download-folder',
        'deploy-css',
        'deploy-vendor',
        'remove-app-sources',
        'deploy-main-app',
        'include-saml-certificates',
        'deploy-web-config',
        'remove-extra-files',
        'add-version',
        'add-survey-popup-settings', runSequenceCallback);

    function runSequenceCallback(){
        if (createTags) {
            runSequence('create-tags', cb);
        } else {
            cb();
        }
    }
});
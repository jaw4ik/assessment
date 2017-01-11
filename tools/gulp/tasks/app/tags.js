import gulp from 'gulp';
import yargs from 'yargs';
import Q from 'q';
import GitHubApi from 'github';

var args = yargs.argv;

var version = typeof args.version === 'string' && args.version !== '' ? args.version : '1.0.0';

gulp.task('create-tags', function () {
    // token for easygenerator-ci (replace with one if you want to crete realeses from your name)
    var authToken = '0793ae79adc6097598e87a90e96130c0bc757e9a',
        reposOwner = 'easygenerator',
        reposList = [
            'easygenerator',
            'simple',
            'personalized-learning',
            'assessment',
            'reader'
        ],
        github = new GitHubApi({
            // required
            version: "3.0.0",
            // optional
            protocol: "https",
            timeout: 5000
        });

    github.authenticate({
        type: "oauth",
        token: authToken
    });

    var defer = Q.defer();

    createTag(reposList.shift(), defer);

    return defer.promise;

    function createTag(repoName, defer) {
        github.releases.createRelease({
            owner: reposOwner,
            repo: repoName,
            tag_name: version,
            name: 'Release v' + version
        }, function (err, result) {
            if (err === null) {
                console.log(repoName + ' - Created');
            } else {
                console.log(repoName + ' - Failed');
            }

            var nextRepo = reposList.shift();
            if (typeof nextRepo !== 'undefined') {
                createTag(nextRepo, defer);
            } else {
                defer.resolve();
            }
        });
    }
});

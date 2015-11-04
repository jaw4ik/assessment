var gulp = require('gulp'),
    Q = require('q'),
    GitHubApi = require('github');

gulp.task('create-tags', function () {
    // token for easygenerator-ci (replace with one if you want to crete realeses from your name)
    var authToken = '4a6abc571a3ebeac204f1980e81b1474a0aa1d5f',
        reposOwner = 'easygenerator',
        reposList = [
            'easygenerator',
            'simple',
            'personalized-learning',
            'assessment',
            'reader',
            'lango-personalized-learning',
            'quiz-for-learni',
            'lango-simple',
            'simple-ie10',
            'simple-pdf',
            'ICEMD',
            'PwC',
            'SC-without-tryagain',
            'ac-nielsen'
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
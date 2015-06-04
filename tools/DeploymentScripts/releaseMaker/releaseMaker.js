var GitHubApi = require("github");

if (process.argv.length === 3){

 	// token for easygenerator-ci (replace with one if you want to crete realeses from your name)
	var authToken = '4a6abc571a3ebeac204f1980e81b1474a0aa1d5f';

	var reposOwner = 'easygenerator';
	var reposList = [
		'easygenerator',
		'simple',
		'exam',
		'personalized-learning',
		'quiz-v2',
		'reader',
		'lango-personalized-learning',
		'quiz-marketing'
	];

	var releaseVersion = process.argv[2];

	var github = new GitHubApi({
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

	for(var index = 0; index < reposList.length; index++){
		var repoName = reposList[index];
		createRelease(repoName);
	}

	function createRelease(repoName){
		github.releases.createRelease({
			owner: reposOwner,	
			repo: repoName,
			tag_name: releaseVersion,
			name: 'Release v'+ releaseVersion
		}, function(err, result){
			if(err === null){
				console.log(repoName + ' - Created');
			}else{
				console.log(repoName + ' - Failed');
			}
		});
	}
}
else{
	console.log('Usage: node releaseMaker.js <0.0.0>');
}
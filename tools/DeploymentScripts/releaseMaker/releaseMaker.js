var GitHubApi = require("github");

if (process.argv.length === 3){

	var authToken = '';

	var reposOwner = 'easygenerator';
	var reposList = [
		'easygenerator',
		'simple',
		'quiz',
		'personalized-learning',
		'quiz-v2',
		'reader'
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
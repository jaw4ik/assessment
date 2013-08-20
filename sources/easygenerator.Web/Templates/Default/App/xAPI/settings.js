define(['xAPI/verbs'],
    function (verbs) {

        var xAPISettings = {
        
            LRSUri: 'http://cloud.scorm.com/ScormEngineInterface/TCAPI/public/',
            
            //LRSUri: 'https://easygenerator.waxlrs.com/TCAPI/',

            authenticationCredentials: {
                username: "9Gm3vd8CD9Jo4Du5I9RE",
                password: "ejuoYRnXFsaWtjooytXZ"
            },
        
            scoresDistribution: {
                minScoreForPositiveResult: 1,
                positiveVerb: verbs.passed
            },

            timeout: 120000,//2 minutes

            defaultLanguage: "en-US",
            xApiVersion: "1.0.0"

        };
        return xAPISettings;

    }
);
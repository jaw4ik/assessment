define(['xAPI/verbs'],
    function (verbs) {

        var xAPISettings = {
        
            LRS: {
                uri: 'http://cloud.scorm.com/ScormEngineInterface/TCAPI/public/',

                credentials: {
                    username: "",
                    password: ""
                }
            },
        
            scoresDistribution: {
                minScoreForPositiveResult: 1,
                positiveVerb: verbs.passed
            },

            errorPageUrl: "xapierror",

            timeout: 120000,//2 minutes

            defaultLanguage: "en-US",
            xApiVersion: "1.0.0"

        };
        return xAPISettings;

    }
);
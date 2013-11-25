define(['../constants'],
    function (constants) {

        var settings = {
            scoresDistribution: {
                minScoreForPositiveResult: 1,
                positiveVerb: constants.verbs.passed
            },

            anonymousCredentials: {
                username: "",
                password: ""
            },

            timeout: 120000,//2 minutes

            defaultLanguage: "en-US",
            xApiVersion: "1.0.0"
        };

        return settings;
    }
);
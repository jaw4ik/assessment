function signUpSecondStepModel() {
    var peopleBusyWithCourseDevelopmentAmount = ko.observable(null),
        needAuthoringTool = ko.observable(null),
        usedAuthoringTool = ko.observable(null),
        isSignupRequestPending = ko.observable(false),
        
        signUp = function () {
            if (isSignupRequestPending()) {
                return;
            }

            isSignupRequestPending(true);

            $.ajax({
                url: '/api/user/signup',
                data: { PeopleBusyWithCourseDevelopmentAmount: peopleBusyWithCourseDevelopmentAmount(), NeedAuthoringTool: needAuthoringTool(), UsedAuthoringTool: usedAuthoringTool() },
                type: 'POST'
            }).done(function (response) {
                app.trackEvent(app.constants.events.signup, { username: response.data }).done(function () {
                    app.openHomePage();
                });
            }).fail(function() {
                isSignupRequestPending(false);
            });
        };
    
    return {
        peopleBusyWithCourseDevelopmentAmount: peopleBusyWithCourseDevelopmentAmount,
        needAuthoringTool: needAuthoringTool,
        usedAuthoringTool: usedAuthoringTool,
        signUp: signUp,
        isSignupRequestPending: isSignupRequestPending
    };
}
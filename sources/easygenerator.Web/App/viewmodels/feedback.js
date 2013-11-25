define(['dataContext', 'notify', 'eventTracker', 'httpWrapper', 'localization/localizationManager'], function (dataContext, notify, eventTracker, httpWrapper, localizationManager) {
    var events = {
        feedback: 'Feedback'
    };


    var viewModel = {
        feedbackMessageFromUser: ko.observable(''),
        feedbackEmail: ko.observable(''),
        isFeedbackMessageErrorVisible: ko.observable(false),
        feedbackMessageFocus: feedbackMessageFocus,
        isShowFeedbackPopup: ko.observable(false),
        sendFeedback: sendFeedback,
        toggleFeedbackPopup: toggleFeedbackPopup,
        isTryMode: false,
        userEmail: '',
        browserCulture: ko.observable(''),
        
        activate: activate
    };

    function sendFeedback() {
            var that = this;
            if (!_.isEmpty(this.feedbackMessageFromUser())) {
                var data = { email: this.isTryMode ? this.feedbackEmail() : this.userEmail, message: this.feedbackMessageFromUser() };
                eventTracker.publish(events.feedback);
                that.isShowFeedbackPopup(false);
                return httpWrapper.post('api/feedback/sendfeedback', data).then(function() {
                    notify.info(localizationManager.localize('successFeedback'));
                    that.feedbackMessageFromUser('');
                    that.feedbackEmail('');
                });
            } else {
                this.isFeedbackMessageErrorVisible(true);
            }
        };
    
        function feedbackMessageFocus() {
            this.isFeedbackMessageErrorVisible(false);
        };
        function toggleFeedbackPopup() {
            this.isShowFeedbackPopup(!this.isShowFeedbackPopup());
        };
    
        function activate() {
            var that = this;
            return Q.fcall(function () {
                that.isTryMode = dataContext.isTryMode;
                that.userEmail = dataContext.userEmail;
                that.browserCulture(localizationManager.currentLanguage);
            });
        };

    return viewModel;
});
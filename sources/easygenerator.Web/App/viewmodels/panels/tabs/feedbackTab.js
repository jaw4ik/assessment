define(['dataContext', 'notify', 'eventTracker', 'httpWrapper', 'localization/localizationManager'], function (dataContext, notify, eventTracker, httpWrapper, localizationManager) {
    var events = {
        feedback: 'Send feedback',
        openFeedbackForm: 'Open feedback form'
    };

    var viewModel = {
        title: 'Feedback',
        feedbackMessageFromUser: ko.observable(''),
        feedbackEmail: ko.observable(''),
        isFeedbackMessageErrorVisible: ko.observable(false),
        feedbackMessageFocus: feedbackMessageFocus,
        isShowFeedbackPopup: ko.observable(false),
        sendFeedback: sendFeedback,
        isTryMode: false,
        userEmail: '',
        activate: activate,
        canActivate: canActivate
    };

    viewModel.isEnabled = ko.computed(function () {
        return true;
    });

    function canActivate() {
        return viewModel.isEnabled();
    }

    function sendFeedback() {
        var that = this;
        if (!_.isEmpty(this.feedbackMessageFromUser())) {
            var data = { email: this.isTryMode ? this.feedbackEmail() : this.userEmail, message: this.feedbackMessageFromUser() };
            eventTracker.publish(events.feedback);
            that.isShowFeedbackPopup(false);
            return httpWrapper.post('api/feedback/sendfeedback', data).then(function () {
                notify.success(localizationManager.localize('successFeedback'));
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

    function activate() {
        var that = this;
        return Q.fcall(function () {
            eventTracker.publish(events.openFeedbackForm);
            that.isTryMode = dataContext.isTryMode;
            that.userEmail = dataContext.userEmail;
        });
    };

    return viewModel;
});
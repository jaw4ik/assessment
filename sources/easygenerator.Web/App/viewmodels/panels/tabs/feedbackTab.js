define(['userContext', 'notify', 'eventTracker', 'http/apiHttpWrapper'],
    function (userContext, notify, eventTracker, apiHttpWrapper) {

        var events = {
            feedback: 'Send feedback',
            openFeedbackForm: 'Open feedback form'
        };

        var viewModel = {
            feedbackSuccessfulySent: ko.observable(false),
            feedbackMessageFromUser: ko.observable(''),
            isFeedbackMessageErrorVisible: ko.observable(false),
            feedbackMessageFocus: feedbackMessageFocus,
            isShowFeedbackPopup: ko.observable(false),
            sendFeedback: sendFeedback,
            userEmail: '',
            activate: activate,
            canActivate: canActivate
        };

        viewModel.isEnabled = ko.computed(function () {
            return true;
        });

        return viewModel;

        function canActivate() {
            return viewModel.isEnabled();
        }

        function sendFeedback() {
            if (_.isEmpty(viewModel.feedbackMessageFromUser())) {
                viewModel.isFeedbackMessageErrorVisible(true);
                return;
            }

            var data = {
                email: viewModel.userEmail,
                message: viewModel.feedbackMessageFromUser()
            };

            eventTracker.publish(events.feedback);
            viewModel.isShowFeedbackPopup(false);
            return apiHttpWrapper.post('api/feedback/sendfeedback', data).then(function () {
                viewModel.feedbackSuccessfulySent(true);
                viewModel.feedbackMessageFromUser('');
            });
        };

        function feedbackMessageFocus() {
            viewModel.isFeedbackMessageErrorVisible(false);
        };

        function activate() {
            return Q.fcall(function () {
                viewModel.feedbackSuccessfulySent(false);
                viewModel.isFeedbackMessageErrorVisible(false);

                eventTracker.publish(events.openFeedbackForm);
                viewModel.userEmail = userContext.identity.email;
            });
        };
    }
);
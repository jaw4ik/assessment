define(['userContext', 'notify', 'eventTracker', 'http/httpWrapper'],
    function (userContext, notify, eventTracker, httpWrapper) {

        var events = {
            feedback: 'Send feedback',
            openFeedbackForm: 'Open feedback form'
        };

        var viewModel = {
            feedbackSuccessfulySent: ko.observable(false),
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
                email: viewModel.isTryMode ? viewModel.feedbackEmail() : viewModel.userEmail,
                message: viewModel.feedbackMessageFromUser()
            };

            eventTracker.publish(events.feedback);
            viewModel.isShowFeedbackPopup(false);
            return httpWrapper.post('api/feedback/sendfeedback', data).then(function () {
                viewModel.feedbackSuccessfulySent(true);
                viewModel.feedbackMessageFromUser('');
                viewModel.feedbackEmail('');
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
                
                viewModel.isTryMode = !_.isObject(userContext.identity);
                viewModel.userEmail = viewModel.isTryMode ? null : userContext.identity.email;
            });
        };
    }
);
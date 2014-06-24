namespace easygenerator.Infrastructure
{
    public static class Constants
    {
        public const string EmailValidationRegexp = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$";
        public const string DefaultAnswerOptionText = "Your answer option here";
       
        public class MailTemplates
        {
            public const string SignedUpUserTemplate = "SignedUpUserTemplate";
            public const string FeedbackTemplate = "FeedbackTemplate";
            public const string NewsletterSubscriptionFailedTemplate = "NewsletterSubscriptionFailedTemplate";
            public const string HttpRequestFailedTemplate = "HttpRequestFailedTemplate";
        }

        public class Collaboration
        {
            public const int MaxCollaboratorsCountForStarterPlan = 3;
        }
    }
}

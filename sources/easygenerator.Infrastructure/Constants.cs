namespace easygenerator.Infrastructure
{
    public static class Constants
    {
        public const string EmailValidationRegexp = @"^[^@\s]+@[^@\s]+$";
        public const string EmailDomainListValidationRegexp = @"^((\w+(-\w+)*\.?)+\w{2,})(\s*,\s*((\w+(-\w+)*\.?)+\w{2,}))*$";
        public const string DefaultCulture = "en-US";
        public static readonly string[] SupportedCultures = { "en", "uk", "zh-cn", "pt-br", "de", "nl", "fr", "es", "it" };
        public static readonly string[] fontTypes = { "application/font-eot", "application/font-svg", "application/font-ttf", "application/font-woff", "application/font-woff2" };

        public class Section
        {
            public const string DefaultImageUrl = "/Content/images/section-default-image.jpg";
        }

        public class MailTemplates
        {
            public const string SignedUpUserTemplate = "SignedUpUserTemplate";
            public const string FeedbackTemplate = "FeedbackTemplate";
            public const string NewEditorFeedbackTemplate = "NewEditorFeedbackTemplate";
            public const string NewsletterSubscriptionFailedTemplate = "NewsletterSubscriptionFailedTemplate";
            public const string IntercomSubscriptionFailedTemplate = "IntercomSubscriptionFailedTemplate";
            public const string HttpRequestFailedTemplate = "HttpRequestFailedTemplate";
            public const string PublicationServerUserRequestFailedTemplate = "PublicationServerUserRequestFailedTemplate";
        }
    }
}

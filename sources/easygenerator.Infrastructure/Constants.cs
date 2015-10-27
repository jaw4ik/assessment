using System;
using System.Web;

namespace easygenerator.Infrastructure
{
    public static class Constants
    {
        public const string EmailValidationRegexp = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,15})+)$";
        public const string DefaultCulture = "en-US";
        public static readonly string[] SupportedCultures = {"en", "uk", "zh-cn", "pt-br", "fr"};


        public class Objective
        {
            public const string DefaultImageUrl = "/Content/images/objective-default-image.jpg";
        }

        public class MailTemplates
        {
            public const string SignedUpUserTemplate = "SignedUpUserTemplate";
            public const string FeedbackTemplate = "FeedbackTemplate";
            public const string NewsletterSubscriptionFailedTemplate = "NewsletterSubscriptionFailedTemplate";
            public const string HttpRequestFailedTemplate = "HttpRequestFailedTemplate";
        }
    }
}

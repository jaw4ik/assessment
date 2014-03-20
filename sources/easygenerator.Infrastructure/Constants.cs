using System;
using System.Collections.Generic;

namespace easygenerator.Infrastructure
{
    public static class Constants
    {
        public const string EmailValidationRegexp = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$";

        public static class SessionConstants
        {
            public const string UserSignUpModel = "UserSignUpModel";
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

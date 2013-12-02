using System;
using System.Collections.Generic;

namespace easygenerator.Infrastructure
{
    public static class Constants
    {
        public const string EmailValidationRegexp = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$";

        public const string DefaultCulture = "en-US";
        public static readonly string[] SupportedCultures = { "en", "nl", "de", "en-US", "de-DE", "nl-NL" };

        public static readonly Dictionary<string, string> NumericCulturesMapping = new Dictionary<string, string>()
        {
            {"en-840", "en-US"},
            {"de-276", "de-DE"},
            {"nl-528", "nl-NL"}
        };

        public static class SessionConstants
        {
            public const string UserSignUpModel = "UserSignUpModel";
        }

        public class MailTemplates
        {
            public const string SignedUpUserTemplate = "SignedUpUserTemplate";
            public const string FeedbackTemplate = "FeedbackTemplate";
        }
    }
}

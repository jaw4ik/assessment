using System;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components
{
    public class SurveyPopupSettingsProvider : ISurveyPopupSettingsProvider
    {
        private readonly ConfigurationReader _configurationReader;

        public SurveyPopupSettingsProvider(ConfigurationReader configurationReader)
        {
            _configurationReader = configurationReader;
            SurveyPopupVersion = _configurationReader.SurveyPopup.Version;
            SurveyPopupPageUrl = _configurationReader.SurveyPopup.PageUrl;
            SurveyPopupOriginUrl = _configurationReader.SurveyPopup.OriginUrl;
            SurveyPopupNumberOfDaysUntilShowUp = ParseNumberOfDays(_configurationReader.SurveyPopup.NumberOfDaysUntilShowUp);
        }

        public string SurveyPopupVersion { get; }
        public string SurveyPopupPageUrl { get; }
        public string SurveyPopupOriginUrl { get; }

        public int SurveyPopupNumberOfDaysUntilShowUp { get; }
        private int ParseNumberOfDays(string toParse) {
            int value;
            return int.TryParse(toParse, out value) ? value : 1;
        }
    }
}
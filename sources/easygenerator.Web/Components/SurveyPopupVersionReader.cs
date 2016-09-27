using System;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components
{
    public class SurveyPopupVersionReader : ISurveyPopupVersionReader
    {
        private readonly ConfigurationReader _configurationReader;

        public SurveyPopupVersionReader(ConfigurationReader configurationReader) {
            _configurationReader = configurationReader;
            SurveyPopupVersion = _configurationReader.GetSurveyPopupVersion;
        }

        public string SurveyPopupVersion { get; }
    }
}
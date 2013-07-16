using easygenerator.AcceptanceTests.ElementObjects;
using easygenerator.AcceptanceTests.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace easygenerator.AcceptanceTests.Steps
{
    [Binding]
    public class UserSettingsSteps
    {
        UserSettingsPage settings;
        public UserSettingsSteps(UserSettingsPage settings)
        {
            this.settings = settings;
        }

        [When(@"open user settings")]
        public void WhenOpenUserSettings()
        {
            settings.Open();
        }

        [When(@"select language '(.*)' in user settings")]
        public void WhenSelectLanguageInUserSettings(string language)
        {
            settings.SelectLanguage(language);
        }

        [When(@"click save user settings")]
        public void WhenClickSaveUserSettings()
        {
            settings.Save();
        }

    }
}

using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers.DriverInitializators
{
    public class FFInitializer : DriverInitializer
    {
        FirefoxProfile profile = new FirefoxProfile();
        public override void SetNoCashe()
        {
            profile.SetPreference("applicationCacheEnabled", false);
        }

        public override void SetCulture(EgLocalization[] culture)
        {
            var cultureString=String.Join(",", culture.Select(c=>localizationStringsIE[c]));
            profile.SetPreference("intl.accept_languages",cultureString );
        }

        public override RemoteWebDriver InitDriver()
        {
            var cap = new DesiredCapabilities();
            cap.SetCapability(FirefoxDriver.ProfileCapabilityName, profile);
            return new FirefoxDriver(cap);
        }
    }
}

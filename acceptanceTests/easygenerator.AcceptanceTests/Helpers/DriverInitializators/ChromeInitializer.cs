using Newtonsoft.Json.Linq;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers.DriverInitializators
{
    public class ChromeInitializer : DriverInitializer
    {
        string preferencesPath;
        ChromeOptions opt = new ChromeOptions();
        public ChromeInitializer()
        {
            var chromeDirectory = Path.Combine(Environment.CurrentDirectory, "ChromeData");
            preferencesPath = Path.Combine(chromeDirectory, "Default\\Preferences");
            opt.AddArgument(@"user-data-dir=" + chromeDirectory);
            opt.AddArgument("--lang=en");
        }
        public override void SetNoCashe()
        {
            opt.AddArguments("disable-application-cache");
            opt.AddArguments("disk-cache-size=0");
        }

        public override void SetCulture(EgLocalization[] culture)
        {
            if (File.Exists(preferencesPath))
            {
                var cultureString = String.Join(",", culture.Select(c => localizationStringsIE[c]));
                var doc = JObject.Parse(File.ReadAllText(preferencesPath));
                if (doc["intl"] == null) doc.Add("intl", JToken.Parse("{\"accept_languages\":\"\"}"));
                doc["intl"]["accept_languages"] = cultureString;
                File.WriteAllText(preferencesPath, doc.ToString());
            }
        }

        public override RemoteWebDriver InitDriver()
        {
            return new ChromeDriver(opt);
        }
    }
}

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
        ChromeOptions opt = new ChromeOptions();
        public ChromeInitializer()
        {
            opt.AddArgument(@"user-data-dir=" + Environment.CurrentDirectory + "\\ChromeData");
            var chromeDirectory = Path.Combine(Environment.CurrentDirectory, "ChromeData");
            var defDirectory = Path.Combine(chromeDirectory, "Default");
            var filePath = Path.Combine(defDirectory, "Preferences");
            if (!Directory.Exists(chromeDirectory))
                Directory.CreateDirectory(chromeDirectory);
            if (!Directory.Exists(defDirectory))
                Directory.CreateDirectory(defDirectory);
            if (!File.Exists(filePath))
            {
                using (var stream = File.CreateText(filePath))
                {
                    stream.Write("{\"intl\": {\"accept_languages\": \"en\"}}");
                    stream.Close();
                }
            }
        }
        public override void SetNoCashe()
        {
            opt.AddArguments("disable-application-cache");
            opt.AddArguments("disk-cache-size=0");
        }

        public override void SetCulture(EgLocalization[] culture)
        {
            var cultureString = String.Join(",", culture.Select(c => localizationStringsIE[c]));
            var path = Path.Combine(Environment.CurrentDirectory, "ChromeData\\Default\\Preferences");
            var doc = JObject.Parse(File.ReadAllText(path));
            doc["intl"]["accept_languages"] = cultureString;
            File.WriteAllText(path, doc.ToString());
        }

        public override RemoteWebDriver InitDriver()
        {
            return new ChromeDriver(opt);
        }
    }
}

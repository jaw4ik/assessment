using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;

namespace easygenerator.AcceptanceTests.Helpers
{

    public class DriverProvider
    {
        static RemoteWebDriver driver;
        const string appCacheCapability = "applicationCacheEnabled";
        const bool isCashEnabled = false;
        public static RemoteWebDriver Current()
        {
            if (driver == default(RemoteWebDriver))
                InitDriver();
            return driver;
        }
        private static void InitDriver()
        {
            string browserName = ConfigurationManager.AppSettings["Browser"];
            switch (browserName)
            {
                case "Chrome":
                    var opt = new ChromeOptions();
                    opt.AddAdditionalCapability(appCacheCapability, isCashEnabled);
                    driver = new ChromeDriver(opt);
                    break;
                case "IE":
                    var pref = new InternetExplorerOptions();
                    pref.AddAdditionalCapability(appCacheCapability, isCashEnabled);
                    driver = new InternetExplorerDriver(pref);
                    break;
                case "FF":
                    var opts = new DesiredCapabilities();
                    opts.SetCapability(appCacheCapability, isCashEnabled);
                    driver = new FirefoxDriver(opts);
                    break;
                default:
                    throw new NotImplementedException("Browser in app.config is not supported");
            }
        }
        public static void StopCurrent() { driver.Quit(); }
    }
}

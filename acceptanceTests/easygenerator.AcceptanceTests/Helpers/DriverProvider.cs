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

        public static RemoteWebDriver Current()
        {
            if (driver == default(RemoteWebDriver))
                GetDriver();
            return driver;
        }
        private static void GetDriver()
        {
            string browserName = ConfigurationManager.AppSettings["Browser"];
            switch (browserName)
            {
                case "Chrome":
                    driver = new ChromeDriver();
                    break;
                case "IE":
                    driver = new InternetExplorerDriver();
                    break;
                case "FF":
                    driver = new FirefoxDriver();
                    break;
                default:
                    throw new NotImplementedException("Browser in app.config is not supported");
            }
        }
        public static void StopCurrent() { driver.Quit(); }
    }
}

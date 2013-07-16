using easygenerator.AcceptanceTests.Helpers.DriverInitializators;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{

    public class DriverProvider
    {
        static DriverProvider currentDriver;
        public static DriverProvider Current()
        {
            if (currentDriver == default(DriverProvider))
                currentDriver = new DriverProvider();
            return currentDriver;
        }

        RemoteWebDriver driver;
        EgLocalization[] localization;
        private DriverProvider()
        {
            localization = new EgLocalization[] { EgLocalization.En };
            InitDriver(localization);
        }
        public RemoteWebDriver Driver { get { return driver; } }
        public EgLocalization[] Localization
        {
            get
            {
                return localization;
            }
            set
            {
                localization = value;
                driver.Quit();
                InitDriver(value);
            }
        }

        public void Stop() { driver.Quit(); }
        private void InitDriver(EgLocalization[] culture)
        {
            var browserName = GetBrowserType();
            var initializer = GetInitializer(browserName);
            initializer.SetCulture(culture);
            initializer.SetNoCashe();
            driver = initializer.InitDriver();
            driver.Manage().Timeouts().ImplicitlyWait(new TimeSpan(0,0,3));
        }

        private DriverInitializer GetInitializer(Browser browserName)
        {
            DriverInitializer initializer;
            switch (browserName)
            {
                case Browser.Chrome:
                    initializer = new ChromeInitializer();
                    break;
                case Browser.IE:
                    initializer = new IEInitializer();
                    break;
                case Browser.FF:
                    initializer = new FFInitializer();
                    break;
                default:
                    throw new NotImplementedException("Browser in app.config is not supported");
            }
            return initializer;
        }
        private Browser GetBrowserType()
        {
            return (Browser)Enum.Parse(typeof(Browser), ConfigurationManager.AppSettings["Browser"]);
        }

    }

}

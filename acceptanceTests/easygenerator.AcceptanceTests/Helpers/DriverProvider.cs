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
using Microsoft.Win32;
using System.IO;

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
        Localization localization = Localization.En;
        private DriverProvider()
        {
            InitDriver(Localization);
        }
        public RemoteWebDriver Driver { get { return driver; } }
        public Localization Localization
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
        private void InitDriver(Localization culture)
        {
            var browserName = GetBrowserType();
            var initializer = GetInitializer(browserName);
            initializer.SetCulture(culture);
            initializer.SetNoCashe();
            driver = initializer.InitDriver();
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
    abstract class DriverInitializer
    {
        protected Dictionary<Localization, string> localizationStringsIE = new Dictionary<Localization, string>()
        {
            {Localization.En,"en-En"},
            {Localization.Nl,"nl-Nl"},
            {Localization.De,"de-De"}
        };
        protected Dictionary<Localization, string> localizationStringsFF = new Dictionary<Localization, string>()
        {
            {Localization.En,"en"},
            {Localization.Nl,"nl"},
            {Localization.De,"de"}
        };
        public abstract void SetNoCashe();
        public abstract void SetCulture(Localization culture);
        public abstract RemoteWebDriver InitDriver();
    }
    class IEInitializer : DriverInitializer
    {
        InternetExplorerOptions pref = new InternetExplorerOptions();
        public override void SetNoCashe()
        {
            var path = Path.Combine(Environment.GetEnvironmentVariable("WINDIR"), "system32\\RunDll32.exe");
            System.Diagnostics.Process.Start(path , "InetCpl.cpl,ClearMyTracksByProcess 8");
        }

        public override void SetCulture(Localization culture)
        {
            RegistryKey myKey = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Internet Explorer\International", true);
            myKey.SetValue("AcceptLanguage", localizationStringsIE[culture], RegistryValueKind.String);
        }

        public override RemoteWebDriver InitDriver()
        {
            return new InternetExplorerDriver(pref);
        }
    }
    class FFInitializer : DriverInitializer
    {
        FirefoxProfile profile = new FirefoxProfile();
        public override void SetNoCashe()
        {
            profile.SetPreference("applicationCacheEnabled", false);
        }

        public override void SetCulture(Localization culture)
        {
            profile.SetPreference("intl.accept_languages", localizationStringsFF[culture]);
        }

        public override RemoteWebDriver InitDriver()
        {
            var cap = new DesiredCapabilities();
            cap.SetCapability(FirefoxDriver.ProfileCapabilityName, profile);
            return new FirefoxDriver(cap);
        }
    }
    class ChromeInitializer : DriverInitializer
    {
        ChromeOptions opt = new ChromeOptions();
        public override void SetNoCashe()
        {
            opt.AddArguments("disable-application-cache");
            opt.AddArguments("disk-cache-size=0");
        }

        public override void SetCulture(Localization culture)
        {
            String browserLanguage = "--lang=" + localizationStringsFF[culture];
            opt.AddArguments(browserLanguage);
        }

        public override RemoteWebDriver InitDriver()
        {
            return new ChromeDriver(opt);
        }
    }
}

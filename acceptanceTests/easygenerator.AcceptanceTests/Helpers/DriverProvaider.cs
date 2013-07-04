using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{

    public class DriverProvaider
    {
        static RemoteWebDriver driver;
        public static RemoteWebDriver Current()
        {
            if (driver == default(RemoteWebDriver))
                driver = new ChromeDriver();
            return driver;
        }
        public static void StopCurrent() { driver.Quit(); }
    }
}

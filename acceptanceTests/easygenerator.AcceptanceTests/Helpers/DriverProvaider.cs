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
    public static class DriverExtensions
    {
        public static void HoverElement(this RemoteWebElement element)
        {
            var builder = new OpenQA.Selenium.Interactions.Actions(element.WrappedDriver);
            var hoverOverRegistrar = builder.MoveToElement(element);
            hoverOverRegistrar.Perform();
        }
        public static T ExecuteScript<T>(this IWebDriver driver,string script)
        {
            return (T)((RemoteWebDriver)driver).ExecuteScript(script);
        }
    }
}

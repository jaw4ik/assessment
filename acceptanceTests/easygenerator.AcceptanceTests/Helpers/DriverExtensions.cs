using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public static class DriverExtensions
    {
        public static void HoverElement(this RemoteWebElement element)
        {
            var builder = new OpenQA.Selenium.Interactions.Actions(element.WrappedDriver);
            var hoverOverRegistrar = builder.MoveToElement(element);
            hoverOverRegistrar.Perform();
        }
        public static T ExecuteScript<T>(this IWebDriver driver, string script)
        {
            return (T)((RemoteWebDriver)driver).ExecuteScript(script);
        }

        public static bool IsVisible(this RemoteWebElement el)
        {
            var pageWidth = el.WrappedDriver.ExecuteScript<Int64>("return document.documentElement.clientWidth");
            var pageHeight = el.WrappedDriver.ExecuteScript<Int64>("return document.documentElement.clientHeight");
            var x1 = el.Size.Width + el.Coordinates.LocationInDom.X;
            var y1 = el.Size.Height + el.Coordinates.LocationInDom.Y;
            var scrollX = el.WrappedDriver.ExecuteScript<Int64>("return window.scrollX");
            var scrollY = el.WrappedDriver.ExecuteScript<Int64>("return window.scrollY");

            var isP1OnScreen = el.Coordinates.LocationInDom.X > scrollX &&
                el.Coordinates.LocationInDom.Y > scrollY;
            var isP2OnScreen = x1 > scrollX + pageWidth &&
                y1 > scrollY + pageHeight;

            return el.Displayed && isP1OnScreen && isP2OnScreen;
        }
        public static string[] CssAttributes(this RemoteWebElement el)
        {
            var attributesString = el.GetAttribute("class");
            return attributesString.Split(' ').ToArray();
        }
        public static bool CssContains(this RemoteWebElement el, string partOfCssClass)
        {
            return el.GetAttribute("class").Contains(partOfCssClass);
        }
    }
}

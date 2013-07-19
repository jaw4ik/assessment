using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
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
            var builder = new Actions(element.WrappedDriver);
            var hoverOverRegistrar = builder.MoveToElement(element);
            hoverOverRegistrar.Perform();
        }
        public static T ExecuteScript<T>(this IWebDriver driver, string script, params object[] args)
        {
            return (T)((RemoteWebDriver)driver).ExecuteScript(script, args);
        }
        public static void ExecuteScript(this IWebDriver driver, string script, params object[] args)
        {
            ((RemoteWebDriver)driver).ExecuteScript(script, args);
        }
        public static string GetTextContent(this RemoteWebElement el)
        {
            var text = el.WrappedDriver.ExecuteScript<string>("return arguments[0].textContent", el);
            return text.Trim();
        }

        public static bool IsVisible(this RemoteWebElement el)
        {
            var pageWidth = el.WrappedDriver.ExecuteScript<Int64>("return document.documentElement.clientWidth");
            var pageHeight = el.WrappedDriver.ExecuteScript<Int64>("return document.documentElement.clientHeight");
            var x = Convert.ToDecimal(el.WrappedDriver.ExecuteScript<object>("return arguments[0].getBoundingClientRect().left", el));
            var y = Convert.ToDecimal(el.WrappedDriver.ExecuteScript< object>("return arguments[0].getBoundingClientRect().top", el));
            var x1 = el.Size.Width + x;
            var y1 = el.Size.Height + y;
            var scrollX = el.WrappedDriver.ExecuteScript<Int64>("return (window.scrollX || window.pageXOffset) ");
            var scrollY = el.WrappedDriver.ExecuteScript<Int64>("return (window.scrollY || window.pageYOffset) ");

            var isP1BiggerThenTopLeft = x >= 0 &&
                y >= 0;
            var isP2BiggerThenBottomRight = x1 <= scrollX + pageWidth &&
                y1 <= scrollY + pageHeight;

            return el.Displayed && isP1BiggerThenTopLeft && isP2BiggerThenBottomRight;
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

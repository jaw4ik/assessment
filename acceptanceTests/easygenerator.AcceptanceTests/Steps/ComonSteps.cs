using easygenerator.AcceptanceTests.Helpers;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace easygenerator.AcceptanceTests.Steps
{
    [Binding]
    public class ComonSteps
    {
        [Given(@"browser localizatiom is set to '(.*)'")]
        public void GivenBrowserLocalizatiomIsSetTo(string localizationString)
        {
            DriverProvider.Current().Localization = localizationString;
        }

        [When(@"open page by url '(.*)'")]
        public void WhenOpenPageByUrl(string url)
        {
            DriverProvider.Current().Driver.Navigate().GoToUrl(url);
            System.Threading.Thread.Sleep(3000);

        }

        [When(@"browser window width and height is set to (.*) and (.*)")]
        public void WhenBrowserWindowWidthIsSetTo(int width, int height)
        {
            DriverProvider.Current().Driver.Manage().Window.Size = new Size(width, height);
        }

        [Then(@"browser navigates to url '(.*)'")]
        public void ThenBrowserNavigatesToUrl(string expectedUrl)
        {
            TestUtils.Assert_IsTrue_WithWait(() => expectedUrl == DriverProvider.Current().Driver.Url,
                "Incorrect url, real is " + DriverProvider.Current().Driver.Url);
        }
        [Then(@"page contains element with text '(.*)'")]
        public void ThenPageContainsElementWithText(string text)
        {
            TestUtils.Assert_IsTrue_WithWait(() => DriverProvider.Current().Driver.FindElementsByXPath("//*[contains(text(),'" + text + "')]").Count > 0,
                "Element not found with text " + text);
        }

        [Given(@"open page by url '(.*)'")]
        public void GivenOpenPageByUrl(string url)
        {
            DriverProvider.Current().Driver.Navigate().GoToUrl(url);
            System.Threading.Thread.Sleep(5000);
        }

        [Given(@"sleep '(.*)'")]
        public void WhenSleep(int timeout)
        {
            System.Threading.Thread.Sleep(timeout);
        }

        [When(@"sleep (.*) milliseconds")]
        public void WhenSleepMillieconds(int timeout)
        {
            System.Threading.Thread.Sleep(timeout);
        }

    }
}

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
        [Given(@"clear data context")]
        public void GivenClearDataContext()
        {
            DataSetter dataSetter = new DataSetter();
            dataSetter.ClearDataContext();
        }


        [Given(@"browser localizatiom is set to '(.*)'")]
        public void GivenBrowserLocalizatiomIsSetTo(string localizationString)
        {
            DriverProvider.Current().Localization = localizationString;
        }

        [When(@"refresh page")]
        public void WhenRefreshPage()
        {
            DriverProvider.Current().Driver.Navigate().Refresh();
        }


        [When(@"open page by url '(.*)'")]
        public void WhenOpenPageByUrl(string url)
        {
            DriverProvider.Current().Driver.Navigate().GoToUrl(url);
            if (!TestUtils.WaitForCondition(() =>
                (DriverProvider.Current().Driver.FindElementsByXPath(".//section[contains(@id,'content')]//section").Count != 0), 20000))
                throw new TimeoutException("Content data is not reachable");

            System.Threading.Thread.Sleep(1000);
            DriverProvider.Current().Driver.Navigate().Refresh();
            System.Threading.Thread.Sleep(1000);
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

        [Then(@"browser navigates to url that contains '(.*)'")]
        public void ThenBrowserNavigatesToUrlThatContains(string expectedUrl)
        {
            TestUtils.Assert_IsTrue_WithWait(() => DriverProvider.Current().Driver.Url.Contains(expectedUrl),
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
            if (!TestUtils.WaitForCondition(() =>
                (bool)DriverProvider.Current().Driver.ExecuteScript("return document.getElementById('content')!==null"), 20000))
                throw new TimeoutException("Content data is not reachable");
            //System.Threading.Thread.Sleep(5000);
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

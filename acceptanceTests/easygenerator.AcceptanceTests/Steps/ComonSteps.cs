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
        [When(@"open page by url '(.*)'")]
        public void WhenOpenPageByUrl(string url)
        {
            DriverProvider.Current().Navigate().GoToUrl(url);
        }

        [When(@"browser window width and height is set to (.*) and (.*)")]
        public void WhenBrowserWindowWidthIsSetTo(int width, int height)
        {
            DriverProvider.Current().Manage().Window.Size = new Size(width, height);
        }

        [When(@"scroll browser window to the bottom")]
        public void WhenScrollBrowserWindowToTheBottom()
        {
            DriverProvider.Current().ExecuteScript("window.scrollTo(0,document.body.scrollHeight)", "");
        }

        [Then(@"browser navigates to url ""(.*)""")]
        public void ThenBrowserNavigatesToUrl(string expectedUrl)
        {
            Assert.AreEqual(expectedUrl, DriverProvider.Current().Url);
        }

    }
}

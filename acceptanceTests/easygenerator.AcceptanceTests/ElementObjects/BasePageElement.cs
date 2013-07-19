using easygenerator.AcceptanceTests.Helpers;
using easygenerator.AcceptanceTests.LinkingModels;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class BasePageElement<T> where T : ILinkingModel, new()
    {
        protected T model = new T();
        public BasePageElement() { }

        protected RemoteWebElement GetByXPath(string path)
        {
            WaitForReady();
            return (RemoteWebElement)DriverProvider.Current().Driver.FindElementByXPath(path);
        }
        protected RemoteWebElement[] GetAllByXPath(string path)
        {
            WaitForReady();
            return DriverProvider.Current().Driver.FindElementsByXPath(path).Cast<RemoteWebElement>().ToArray();
        }
        protected bool ExistsOnPage(string path)
        {
            return DriverProvider.Current().Driver.Exists(path);
        }
        protected void WaitForReady()
        {
            if (!TestUtils.WaitForCondition(() =>
                (bool)DriverProvider.Current().Driver.ExecuteScript("return document.getElementById('content')!==null"),20000))
                throw new TimeoutException("Content data is not reachable");
        }
    }
}

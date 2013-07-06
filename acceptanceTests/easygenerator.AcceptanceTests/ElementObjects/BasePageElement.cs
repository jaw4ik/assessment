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
    public class BasePageElement<T> where T : ILinkinkModel, new()
    {
        protected T model = new T();
        public BasePageElement() { }

        protected RemoteWebElement GetByXPath(string path)
        {
            return (RemoteWebElement)DriverProvider.Current().FindElementByXPath(path);
        }
        protected RemoteWebElement[] GetAllByXPath(string path)
        {
            return DriverProvider.Current().FindElementsByXPath(path).Cast<RemoteWebElement>().ToArray();
        }
    }
}

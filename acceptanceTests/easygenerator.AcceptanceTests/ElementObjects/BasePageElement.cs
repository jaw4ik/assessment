using easygenerator.AcceptanceTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class BasePageElement<T> where T : BaseLinkinkModel, new()
    {
        protected T model = new T();
        public BasePageElement() { }
        public BasePageElement(RemoteWebElement container)
        {
            this.Container = container;
        }
        public RemoteWebElement Container { get; private set; }

        protected RemoteWebElement GetByXPath(string path)
        {
            return (RemoteWebElement)DriverProvaider.Current().FindElementByXPath(path);
        }
        protected RemoteWebElement[] GetAllByXPath(string path)
        {
            return DriverProvaider.Current().FindElementsByXPath(path).Cast<RemoteWebElement>().ToArray();
        }

        protected RemoteWebElement GetByXPathInside(string path)
        {
            return (RemoteWebElement)DriverProvaider.Current().FindElementByXPath(path);
        }
        protected RemoteWebElement[] GetAllByXPathInside(string path)
        {
            return DriverProvaider.Current().FindElementsByXPath(path).Cast<RemoteWebElement>().ToArray();
        }
    }
}

using easygenerator.AcceptanceTests.LinkingModels;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class ContainerElement<T> : BasePageElement<T> where T : ILinkinkModel, new()
    {
        public ContainerElement(RemoteWebElement container)
        {
            this.Container = container;
        }
        public RemoteWebElement Container { get; private set; }

        protected RemoteWebElement GetByXPathInside(string path)
        {
            return (RemoteWebElement)Container.FindElementByXPath(path);
        }
        protected RemoteWebElement[] GetAllByXPathInside(string path)
        {
            return Container.FindElementsByXPath(path).Cast<RemoteWebElement>().ToArray();
        }
    }
}

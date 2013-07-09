using easygenerator.AcceptanceTests.LinkingModels;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.AcceptanceTests.Helpers;
using OpenQA.Selenium.Remote;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class PublicationsListItem : ContainerElement<PublicationListItemLinkingModel>
    {

        public PublicationsListItem(RemoteWebElement container)
            : base(container) { }

        public string Title
        {
            get
            {
                var el = GetByXPathInside(model.Title);
                return el.GetTextContent();
            }
        }


        internal void Select()
        {
            GetByXPathInside(model.SelectElement).Click();
        }

        public bool IsSelected
        {
            get
            {
                return Container.CssContains(model.IsSelectedClass);
            }
        }

        public bool IsOpenEnabled
        {
            get
            {
                var openEl = Container.FindElementByXPath(model.OpenElement);
                return openEl.Displayed;
            }
        }

        public bool IsSelectEnabled
        {
            get
            {
                var selectEl = Container.FindElementByXPath(model.SelectElement);
                return selectEl.Displayed;
            }
        }

        internal void Open()
        {
            GetByXPathInside(model.OpenElement).Click();
        }

    }
}

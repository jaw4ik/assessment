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
    public class PublicationsListItem : BasePageElement<PublicationListItemLinkingModel>
    {

        public PublicationsListItem(RemoteWebElement container)
            : base(container) { }

        public string Title
        {
            get
            {
                var el = Container.FindElementByXPath(model.Title);
                return el.Text;
            }
        }

        internal void Click()
        {
            Container.Click();
        }

        internal bool IsVisisble()
        {
            return Container.IsVisible();
        }

        internal void Hover()
        {
            Container.HoverElement();
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
    }
}

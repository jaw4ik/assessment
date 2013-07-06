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
    public class ObjectivesListItem : ConteinerElement<ObjectiveListItemLinkingModel>
    {

        public ObjectivesListItem(RemoteWebElement container)
            : base(container) { }

        public string Title
        {
            get
            {
                var el = Container.FindElementByXPath(model.Title);
                return el.Text;
            }
        }

        internal void Select()
        {
            GetByXPathInside(model.SelectElement).Click();
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
                return GetByXPathInside(model.SelectElement).CssContains(model.IsSelectedClass);
            }
        }

        public bool IsOpenEnabled
        {
            get
            {
                var openEl = GetByXPathInside(model.OpenElement);
                return openEl.Displayed;
            }
        }
        public bool IsSelectedEnabled
        {
            get
            {
                var openEl = GetByXPathInside(model.SelectElement);
                return openEl.Displayed;
            }
        }


        internal void Open()
        {
            GetByXPathInside(model.OpenElement).Click();
        }
    }
}

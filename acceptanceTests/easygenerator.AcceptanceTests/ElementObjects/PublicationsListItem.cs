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

        public string ObjectiveCount
        {
            get
            {
                var el = GetByXPathInside(model.ObjectiveCountElement);
                return el.GetTextContent();
            }
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

        public bool IsBuildEnabled
        {
            get
            {
                var selectEl = Container.FindElementByXPath(model.BuildElement);
                return selectEl.Displayed;
            }
        }

        public bool IsDownloadEnabled
        {
            get
            {
                var selectEl = Container.FindElementByXPath(model.DownloadElement);
                return selectEl.Displayed;
            }
        }

        public bool IsRebuildEnabled
        {
            get
            {
                var selectEl = Container.FindElementByXPath(model.RebuildElement);
                return selectEl.Displayed;
            }
        }

        

        public bool IsBuildingStatusDisplayed
        {
            get
            {
                return Container.FindElementByXPath(model.BuildingStatus).Displayed;
            }
        }

        public bool IsCompleteStatusDisplayed
        {
            get
            {                
                return base.ExistsOnPage(model.CompleteStatus);                
            }
        }

        public bool IsFailedStatusDisplayed
        {
            get
            {
                return base.ExistsOnPage(model.FailedStatus);
            }
        }

        internal void Open()
        {
            GetByXPathInside(model.OpenElement).Click();
        }

        internal void Select()
        {
            GetByXPathInside(model.SelectElement).Click();
        }

        internal void Build()
        {
            GetByXPathInside(model.BuildElement).Click();
        }

        internal void Rebuild()
        {
            GetByXPathInside(model.RebuildElement).Click();
        }


        internal void Download()
        {
            var el = GetByXPathInside(model.DownloadElement);
            el.Click();
            System.Threading.Thread.Sleep(3000);
        }
    }
}

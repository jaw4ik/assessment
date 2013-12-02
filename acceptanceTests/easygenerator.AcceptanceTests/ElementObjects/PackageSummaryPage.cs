using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.AcceptanceTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class PackageSummaryPage : BasePageElement<PackageSummaryPageLinkingModel>
    {
        public PackageSummaryPage() { }

        public string OverallProgressScore
        {
            get
            {
                var el = GetByXPath(model.OverallProgressScore);
                return el.GetTextContent();
            }
        }

        public ObjectiveProgressItem[] ObjectiveProgressItems
        {
            get
            {
                var items = GetAllByXPath(model.ObjectiveProgressItem);
                return items.Select(it => new ObjectiveProgressItem(it)).ToArray();
            }
        }
        
        internal void BackLinkClick()
        {
            GetByXPath(model.BackLink).Click();
        }

        internal void FinishLinkClick()
        {
            GetByXPath(model.FinishLink).Click();
        }

        internal void HomeLinkClick()
        {
            GetByXPath(model.HomeLink).Click();
        }

        public bool isAlertPresent()
        {
            try
            {
                //DriverProvider.Current().Driver.SwitchTo().Alert();
                DriverProvider.Current().Driver.SwitchTo().Alert().Accept();
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        
    }

    public class ObjectiveProgressItem : ContainerElement<PackageSummaryPageLinkingModel>
    {

        public ObjectiveProgressItem(RemoteWebElement container)
            : base(container) { }

        public string Title
        {
            get
            {
                var el = GetByXPathInside(model.ObjectiveTitle);
                return el.GetTextContent();
            }
        }

        public string Value
        {
            get
            {
                var el = GetByXPathInside(model.ObjectiveProgressValue);
                return el.GetTextContent();
            }
        }

        public string MeterValue
        {
            get
            {
                var el = GetByXPathInside(model.ObjectiveProgressMeterValue);
                return el.GetAttribute("style");
            }
        }


        
    }
}

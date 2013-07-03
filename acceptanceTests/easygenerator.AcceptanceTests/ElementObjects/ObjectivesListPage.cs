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


    public enum Order { Ascending, Descending }
    public class ObjectivesListPage : BasePageElement<ObjectiveListLinkingModel>
    {
        public ObjectivesListPage() { }
        public ObjectivesListItem[] Items
        {
            get
            {
                var items = GetAllByXPath(model.Item);
                return items.Select(it => new ObjectivesListItem(it)).ToArray();
            }
        }

        public Order Order { get; set; }

        internal object GetColumnsCount()
        {
            throw new NotImplementedException();
        }

        internal void ClickHomePageIcon()
        {
            DriverProveider.Current().FindElementByXPath(model.HomePageIcon).Click();
        }
    }
}

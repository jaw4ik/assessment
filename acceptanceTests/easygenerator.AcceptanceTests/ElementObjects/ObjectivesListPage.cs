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

        public Order Order
        {
            get
            {
                var isAscEnabled = model.IsTitelSortingActive(Container.FindElementByXPath(model.SortingByTitleAsc));
                var isDescEnabled = model.IsTitelSortingActive(Container.FindElementByXPath(model.SortingByTitleDesc));
                if (isAscEnabled == isDescEnabled)
                    throw new InvalidOperationException("Both order buttons are in same state");
                return isAscEnabled ? Order.Ascending : Order.Descending;
            }
            set
            {
                var expectedOrder = value == Order.Ascending ? model.SortingByTitleAsc : model.SortingByTitleDesc;
                Container.FindElementByXPath(expectedOrder).Click();
            }
        }

        internal int GetColumnsCount()
        {
            var items = Items;
            var columnsCount = 0;
            List<int> xOfColums = new List<int>();
            foreach (var item in items)
            {
                var x = item.Container.Location.X;
                if (!xOfColums.Contains(x))
                {
                    columnsCount++;
                    xOfColums.Add(x);
                }
            }
            return columnsCount;
        }

        public void NavigateToPublicationsUsingTabs()
        {
            var link = GetByXPath(model.TabPublicationsLink);
            link.Click();
        }

    }
}

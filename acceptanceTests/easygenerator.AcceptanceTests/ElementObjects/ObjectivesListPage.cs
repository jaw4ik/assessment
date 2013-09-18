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
        public ObjectivesListItem ItemByTitle(string title)
        {
            return Items.First(it => it.Title == title);
        }
        public Order Order
        {
            get
            {
                var isAscEnabled = GetByXPath(model.SortingByTitleAsc).CssContains(model.IsTitelSortingActiveClass);
                var isDescEnabled = GetByXPath(model.SortingByTitleDesc).CssContains(model.IsTitelSortingActiveClass);
                if (isAscEnabled == isDescEnabled)
                    throw new InvalidOperationException("Both order buttons are in same state");
                return isAscEnabled ? Order.Ascending : Order.Descending;
            }
            set
            {
                var expectedOrder = value == Order.Ascending ? model.SortingByTitleAsc : model.SortingByTitleDesc;
                GetByXPath(expectedOrder).Click();
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


        public string Header
        {
            get
            {
                return GetByXPath(model.Header).Text;
            }
        }

        internal void ClickAddNewObjectiveButton()
        {
            GetByXPath(model.AddNewObjectiveButton).Click();
        }


        public bool DeleteButtonIsDisplayed
        {
            get
            {
                return ExistsOnPage(model.DeleteButton);
            }
        }

        internal void DeleteButtonClick()
        {
            GetByXPath(model.DeleteButton).Click();
        }

        public bool ErrorNotificationIsShown
        {
            get
            {
                if (ExistsOnPage(model.Notification))
                {
                    var tmp = GetByXPath(model.Notification).CssContains("error");
                    return tmp;
                }
                return false;
            }
        }
    }
}

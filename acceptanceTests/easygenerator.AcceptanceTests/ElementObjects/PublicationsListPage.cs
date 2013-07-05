﻿using easygenerator.AcceptanceTests.LinkingModels;
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
    public class PublicationsListPage : BasePageElement<PublicationListLinkingModel>
    {
        public PublicationsListPage() { }

        public PublicationsListItem[] Items
        {
            get
            {
                var items = GetAllByXPath(model.Item);
                return items.Select(it => new PublicationsListItem(it)).ToArray();
            }
        }

        public Order Order
        {
            get
            {
                var isAscEnabled = GetByXPathInside(model.SortingByTitleAsc).CssContains(model.IsTitelSortingActiveClass);
                var isDescEnabled = GetByXPathInside(model.SortingByTitleDesc).CssContains(model.IsTitelSortingActiveClass);
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
    }
}

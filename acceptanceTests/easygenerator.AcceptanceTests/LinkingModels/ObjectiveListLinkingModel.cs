using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ObjectiveListLinkingModel : ILinkingModel
    {
        public string Header = "//div[contains(@class,'objectives-header-title')]";
        public string Item = ".//li[contains(@class,'objective-brief')]";
        public string SortingByTitleAsc = "//div[contains(@class,'objectives-sort-by-title-asc')]";
        public string SortingByTitleDesc = "//div[contains(@class,'objectives-sort-by-title-desc')]";
        public string TabPublicationsLink = "//a[contains(@class,'top-navigation-btn')]";
        public string IsTitelSortingActiveClass = "active";

        //CUD Objective

        public string AddNewObjectiveButton = ".//a[contains(@class,'objectives-header-create-link')]";
        public string DeleteButton = ".//div[contains(@class,'objectives-header-title')]//span[contains(@class,'header-toolbar-item-wrapper')]";

    }
}

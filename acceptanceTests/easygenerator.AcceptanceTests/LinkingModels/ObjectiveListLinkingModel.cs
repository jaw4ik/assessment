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
        public string Item = ".//li[contains(@class,'main-content-list-item')]";
        public string SortingByTitleAsc = "//div[contains(@class,'objectives-sort-by-title-asc')]";
        public string SortingByTitleDesc = "//div[contains(@class,'objectives-sort-by-title-desc')]";
        public string TabPublicationsLink = "//a[contains(@class,'top-navigation-item')]";
        public string IsTitelSortingActiveClass = "active";

        //CUD Objective

        public string AddNewObjectiveButton = ".//div[contains(@class,'create-new-holder')]";
        public string DeleteButton = ".//span[contains(@class, 'delete-selected-text')]";
        public string Notification = ".//div[contains(@class,'notification-container')]//div[contains(@class,'notification')]";

    }
}

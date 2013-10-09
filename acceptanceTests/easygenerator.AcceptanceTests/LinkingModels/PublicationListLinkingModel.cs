using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PublicationListLinkingModel : ILinkingModel
    {
        public string Item = ".//li[contains(@class,'experience-brief')]";
        public string SortingByTitleAsc = "//div[contains(@class,'experiences-sort-by-title-asc')]";
        public string SortingByTitleDesc = "//div[contains(@class,'experiences-sort-by-title-desc')]";
        public string IsTitelSortingActiveClass = "active";
        public string ObjectivesTabLink = "//a[contains(@class,'top-navigation-item')]";

        //CUD Experiences

        public string AddNewExperienceButton = ".//a[contains(@class,'experiences-header-create-link')]";
        public string DeleteButton = ".//span[contains(@class, 'header-toolbar-item-wrapper')]";

        public string Notification = ".//div[contains(@class,'notification-container')]//div[contains(@class,'notification')]";
    }
}

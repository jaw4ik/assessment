using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PublicationListLinkingModel : ILinkinkModel
    {
        public string Item = ".//li[contains(@class,'experience-brief'])";
        public string SortingByTitleAsc = "//div[contains(@class,'experiences-sort-by-title-asc')]";
        public string SortingByTitleDesc = "//div[contains(@class,'experiences-sort-by-title-desc')]";
        public string IsTitelSortingActiveClass = "active";
        public string ObjectivesTabLink = "//a[@href='#/objectives']";
    }
}

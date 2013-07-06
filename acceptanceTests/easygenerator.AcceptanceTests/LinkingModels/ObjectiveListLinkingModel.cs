using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ObjectiveListLinkingModel : ILinkinkModel
    {
        public string Item = ".//li[@class='objective-brief']";
        public string SortingByTitleAsc = "//div[contains(@class,'objectives-sort-by-title-asc')]";
        public string SortingByTitleDesc = "//div[contains(@class,'objectives-sort-by-title-desc')]";
        public string TabPublicationsLink = ".//a[@href='#/publications']";
        public string IsTitelSortingActiveClass = "active";
    }
}

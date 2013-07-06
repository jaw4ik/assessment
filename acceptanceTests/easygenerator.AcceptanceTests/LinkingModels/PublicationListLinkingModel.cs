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
        public string Item = ".//li[@class='publication-brief']";
        public string SortingByTitleAsc = "//div[contains(@class,'publications-sort-by-title-asc')]";
        public string SortingByTitleDesc = "//div[contains(@class,'publications-sort-by-title-desc')]";
        public string IsTitelSortingActiveClass = "active";
        public string PublicationsTabLink = "//a[@href='#/objectives']";
    }
}

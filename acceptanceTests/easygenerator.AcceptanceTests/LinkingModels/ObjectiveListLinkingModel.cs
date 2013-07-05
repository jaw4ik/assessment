using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ObjectiveListLinkingModel : BaseLinkinkModel
    {
        public string Item = ".//li[@class='objective-brief']";
        public string Container = "//section[@id='objectives']";
        public string SortingByTitleAsc = "//button[contains(@class,'sortByTitleAsc')]";
        public string SortingByTitleDesc = "//button[contains(@class,'sortByTitleDesc')]";
        public string TabPublicationsLink = ".//a[@href='#/publications']";

        public bool IsTitelSortingActive(IWebElement el)
        {
            return el.GetAttribute("class").Contains("active");
        }
    }
}

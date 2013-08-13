using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionsListLinkingModel : ILinkingModel
    {
        public string Item = ".//li[contains(@class,'content-list-item')]";
        public string OrderAsc = "//div[contains(@class,'questions-sort-by-title-asc')]";
        public string OrderDesc = "//div[contains(@class,'questions-sort-by-title-desc')]";
        public string ObjectivesTabLink = "//a[@href='#/objectives']";
        public string IsTitelSortingActiveClass = "active";
    }
}

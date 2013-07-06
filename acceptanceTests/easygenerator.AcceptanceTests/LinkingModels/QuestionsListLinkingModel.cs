using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionsListLinkingModel : ILinkinkModel
    {
        public string Item = "";
        public string OrderAsc = "//div[contains(@class,'questions-sort-by-title-asc')]";
        public string OrderDesc = "//div[contains(@class,'questions-sort-by-title-desc')]";
        public string ObjectivesTabLink = "//a[@href='#/publications']";
        public string IsTitelSortingActiveClass = "active";
    }
}

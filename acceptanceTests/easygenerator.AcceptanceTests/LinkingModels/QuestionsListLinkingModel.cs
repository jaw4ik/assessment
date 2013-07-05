using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionsListLinkingModel : BaseLinkinkModel
    {
        public string Item = "";
        public string OrderAsc = "";
        public string OrderDesc = "";
        public string BackToObjectives = "";
        public bool IsTitelSortingActive(IWebElement el)
        {
            return el.GetAttribute("class").Contains("active");
        }
    }
}

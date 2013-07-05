using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionListItemLinkingModel : BaseLinkinkModel
    {
        public string QuestionTitle = "";
        public string EditButton = "";
        public string AddButton = "";
        public string OpenButton = "";
        public bool IsHoverEnabled(IWebElement el)
        {
            return el.GetAttribute("class").Contains("active");
        }
        public bool IsSelectedEnabled(IWebElement el)
        {
            return el.GetAttribute("class").Contains("selected");
        }
    }
}

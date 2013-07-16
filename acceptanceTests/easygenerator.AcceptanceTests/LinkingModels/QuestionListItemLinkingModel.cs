using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionListItemLinkingModel : ILinkingModel
    {
        public string QuestionTitle = ".//div[contains(@class,'question-title')]";
        public string EditButton = "";
        public string AddButton = "//a[contains(@class,'questions-header-create-link')]";
        public string OpenButton = "";
        public string HoverPartClass = "active";
        public string SelectedPartClass = "selected";
    }
}

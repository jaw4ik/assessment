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
        public string QuestionTitle = "";
        public string EditButton = "";
        public string AddButton = "";
        public string OpenButton = "";
        public string HoverPartClass = "active";
        public string SelectedPartClass = "selected";
    }
}

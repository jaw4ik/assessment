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
        public string AddButton = "//a[contains(@class,'questions-header-create-link')]";
        public string OpenButton = ".//div[contains(@class,'question-open')]";
        //public string EditButton = ".//div[contains(@class,'question-edit')]";
        public string SelectElement = ".//div[contains(@class,'question-select')]";
        public string OpenElement = ".//div[contains(@class,'question-title')]";
        public string SelectedPartClass = "selected";
    }
}

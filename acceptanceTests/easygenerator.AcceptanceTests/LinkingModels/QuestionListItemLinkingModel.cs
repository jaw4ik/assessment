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
        public string QuestionTitle = ".//div[contains(@class,'text-block')]//p";
        public string AddButton = "//a[contains(@class,'questions-header-create-link')]";
        public string OpenButton = ".//div[contains(@class,'item-options')]//div[contains(@class,'edit')]";
        //public string EditButton = ".//div[contains(@class,'question-edit')]";
        public string SelectElement = ".//div[contains(@class,'item-options')]//div[contains(@class,'select')]";
        //public string OpenElement = ".//div[contains(@class,'item-options')]//div[contains(@class,'open')]";
        public string SelectedPartClass = "selected";
    }
}

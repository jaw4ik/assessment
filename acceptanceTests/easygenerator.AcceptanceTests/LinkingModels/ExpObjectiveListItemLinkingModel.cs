using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ExpObjectiveListItemLinkingModel : ILinkingModel
    {
        public string Title = ".//div[contains(@class,'text-block')]";
        public string SelectElement = ".//div[contains(@class,'item-options')]//div[contains(@class,'select')]";
        public string OpenElement = ".//div[contains(@class,'item-options')]//div[contains(@class,'open')]";
        public string IsSelectedClass = "selected";
        public string QuestionCountElement = ".//div[contains(@class,'li-related-objective-question-count-text')]";
    }
}
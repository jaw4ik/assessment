using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionPageLinkingModel : ILinkingModel
    {
        public string AnswerItem = ".//li[contains(@class,'questions-list-item')]";
        public string ExplanationItem = "";
        public string CorrectItemClass = "answer-correct-icon";
        public string IsCorrect = "";
        public string AnswerItemText = "";
        public string ExplanationText = "";
    }
}

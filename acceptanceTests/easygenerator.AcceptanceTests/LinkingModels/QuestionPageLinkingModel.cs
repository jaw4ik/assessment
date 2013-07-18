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

        public string AnswerItem = "//div[contains(@class,'question-answers')]//div[@class='question-content-list-item']";
        public string ExplanationItem = "//div[contains(@class,'question-explanations')]//div[@class='question-content-list-item']";
        public string CorrectItemClass = "answer-correct-icon";
        public string AnswerItemText = ".//div[@class='question-answer-text']";
        public string ExplanationText = ".//div[@class='question-explanations-item']";
    }
}

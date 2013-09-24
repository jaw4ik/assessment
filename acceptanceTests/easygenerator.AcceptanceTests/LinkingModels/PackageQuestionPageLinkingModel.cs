using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PackageQuestionPageLinkingModel : ILinkingModel
    {
        public string PackageQuestionTitle = ".//div[contains(@class,'caption-text')]//span";

        public string PackageAnswerItem = ".//ul[contains(@class,'question-answers')]//li[contains(@class,'question-answer')]";
        public string PackageAnswerItemText = ".//div[contains(@class,'question-answer-text')]";

        public string SubmitButton = ".//button[contains(@class,'btn-submit')]";

        public string ShowExplanationsLink = ".//div[contains(@class,'navigation-link-container')]//div[contains(@class,'pull-right')]//a";
        public string BackToObjectivesLink = ".//div[contains(@class,'navigation-link-container')]//div[contains(@class,'pull-left')]//a";
        public string ProgressSummaryLink = ".//ul[contains(@class,'navigation-menu')]//li[contains(@class,'pull-right')]//a";
        public string HomeLink = ".//ul[contains(@class,'navigation-menu')]//li[contains(@class,'pull-left')]//a";
        
    }
}

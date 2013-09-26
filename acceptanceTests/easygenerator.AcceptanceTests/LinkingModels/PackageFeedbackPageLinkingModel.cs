using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PackageFeedbackPageLinkingModel : ILinkingModel
    {
        public string QuestionProgressScore = ".//div[contains(@class,'question-progress-score')]";

        public string ShowExplanationsButton = ".//div[contains(@class,'navigation-btn-container')]//a[contains(@class,'navigation-btn-left')]";
        public string TryAgainButton = ".//div[contains(@class,'navigation-btn-container')]//a[contains(@class,'navigation-btn-right')]";

        public string BackToObjectivesLink = ".//div[contains(@class,'navigation-link-container')]//div[contains(@class,'pull-left')]//a";
        public string ProgressSummaryLink = ".//ul[contains(@class,'navigation-menu')]//li[contains(@class,'pull-right')]//a";
        public string HomeLink = ".//ul[contains(@class,'navigation-menu')]//li[contains(@class,'pull-left')]//a";


    }
}

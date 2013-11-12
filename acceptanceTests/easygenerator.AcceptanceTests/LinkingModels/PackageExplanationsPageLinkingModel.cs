using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PackageExplanationsPageLinkingModel : ILinkingModel
    {
        public string PackageExplanation = ".//ul[contains(@class,'learning-content-items')]//li[contains(@class,'learning-content-item')]";

        public string BackToQuestionLink = ".//div[contains(@class,'navigation-link-container')]//div[contains(@class,'pull-right')]//a";
        public string BackToObjectivesLink = ".//div[contains(@class,'navigation-link-container')]//div[contains(@class,'pull-left')]//a";
        public string ProgressSummaryLink = ".//ul[contains(@class,'navigation-menu')]//li[contains(@class,'pull-right')]//a";
        public string HomeLink = ".//ul[contains(@class,'navigation-menu')]//li[contains(@class,'pull-left')]//a";

    }
}

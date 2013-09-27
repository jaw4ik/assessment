using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PackageSummaryPageLinkingModel : ILinkingModel
    {
        public string HomeLink = ".//ul[contains(@class,'navigation-menu')]//li[contains(@class,'pull-left')]//a";

        public string BackLink = ".//div[contains(@class,'navigation-link-container')]//div[contains(@class,'pull-left')]//a";
        public string FinishLink = ".//div[contains(@class,'navigation-link-container')]//div[contains(@class,'pull-right')]//a";

        public string OverallProgressScore = ".//div[contains(@class,'summary-progress-overall-score')]";

        public string ObjectivesSummaryContainer = ".//ul[contains(@class,'summary-objectives')]";

        public string ObjectiveProgressItem = ".//li[contains(@class,'summary-objective')]";
        public string ObjectiveTitle = ".//div[contains(@class,'summary-objective-title')]";
        public string ObjectiveProgressValue = ".//div[contains(@class,'summary-objective-progress-value')]";
        public string ObjectiveProgressMeterValue = ".//div[contains(@class,'meter-value')]";
        


    }
}

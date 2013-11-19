using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PackageObjectiveListLinkingModel : ILinkingModel
    {
        public string ObjectiveItem = ".//li[contains(@class,'objective-brief-list-item')]";
        public string QuestionItem = ".//li[contains(@class,'question-brief')]";
        public string ProgressSummaryButton = ".//ul[contains(@class,'navigation-menu')]//a[contains(@class,'navigation-menu-item-link')]";

        public string DoNotReportLink = ".//a[contains(@class,'xapi-btn-left pull-left')]";
        
        
        
    }
}

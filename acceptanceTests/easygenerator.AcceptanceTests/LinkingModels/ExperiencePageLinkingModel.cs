using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ExperiencePageLinkingModel : ILinkingModel
    {
        public string ExperienceTitle = ".//div[contains(@class,'view-header-title')]//div[contains(@class,'edit-field')]";
        public string Item = ".//li[contains(@class,'content-list-item')]";

        public string BackToExperiencesLink = "//a[contains(@class,'nav-control') and contains(@class,'left')]";

        public string NextExperienceButton = ".//section[contains(@class,'experience')]//header[contains(@class,'view-header')]//a[contains(@class,'view-header-nav-btn next')]";
        public string PreviousExperienceButton = ".//section[contains(@class,'experience')]//header[contains(@class,'view-header')]//a[contains(@class,'view-header-nav-btn previous')]";

        //public string BuildButton = "//div[contains(@class,'experience-build-progress-status-item')]";
        public string BuildButton = "//div[contains(@class,'build') and contains(@data-bind,'click: buildExperience')]";
        public string DownloadButton = "//div[contains(@class,'experience-build-progress-status-item') and contains(@data-bind,'click: downloadExperience')]";
        public string RebuildButton = "//div[contains(@class,'rebuild') and contains(@data-bind,'click: buildExperience')]";

        public string BuildingStatus = ".//div[contains(@class,'experience-build-progress-status-item')]";
        public string FailedStatus = ".//div[contains(@class,'experience-build-progress-status-item failed')]";
        
        public string CharsCounter = ".//div[contains(@class, 'view-header-title')]//div[contains(@class, 'chars-counter')]";

        public string ExperienceHeaderTitleText = ".//div[contains(@class,'page-view-caption-text')]";

        public string IncludeButton = ".//div[contains(@class,'list-controls-holder')]//span[contains(@class, 'add')]";
        public string FinishButton = ".//a[contains(@class,'experiences-header-finish-link')]";
        public string ExcludeButton = ".//div[contains(@class,'list-controls-holder')]//span[contains(@class,'disconnect')]";

        public string ShowNotConnectedObjectives = ".//div[contains(@data-bind,'showAllAvailableObjectives')]";
        public string ShowConnectedObjectives = ".//div[contains(@data-bind,'showConnectedObjectives')]";
    }
}

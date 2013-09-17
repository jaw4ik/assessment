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
        public string ExperienceTitle = ".//section[contains(@class,'experience')]//header[contains(@class,'view-header')]//div[contains(@class,'view-header-title-text')]";
        public string Item = ".//li[contains(@class,'content-list-item')]";

        public string BackToExperiencesLink = "//a[contains(@class,'nav-control') and contains(@class,'left')]";

        public string NextExperienceButton = ".//section[contains(@class,'experience')]//header[contains(@class,'view-header')]//a[contains(@class,'view-header-nav-btn next')]";
        public string PreviousExperienceButton = ".//section[contains(@class,'experience')]//header[contains(@class,'view-header')]//a[contains(@class,'view-header-nav-btn previous')]";

        //public string BuildButton = "//div[contains(@class,'experience-build-progress-status-item')]";
        public string BuildButton = "//div[contains(@data-bind,'click: buildExperience')]";
        public string DownloadButton = "//div[contains(@data-bind,'click: downloadExperience')]";

        public string CharsCounter = ".//div[contains(@class, 'view-header-title')]//div[contains(@class, 'chars-counter')]";
    }
}

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
        public string ExperienceTitle = "//div[contains(@class,'experience-header-title')]";
        public string Item = ".//li[contains(@class,'content-list-item')]";

        public string BackToExperiencesLink = "//a[contains(@class,'nav-control') and contains(@class,'left')]";

        public string NextExperienceButton = "//aside[contains(@class,'next')]//a[contains(@class,'next-btn')]";
        public string PreviousExperienceButton = "//aside[contains(@class,'previous')]//a[contains(@class,'prev-btn')]";

        //public string BuildButton = "//div[contains(@class,'experience-build-progress-status-item')]";
        public string BuildButton = "//div[contains(@data-bind,'click: buildExperience')]";
        public string DownloadButton = "//div[contains(@data-bind,'click: downloadExperience')]";
    }
}

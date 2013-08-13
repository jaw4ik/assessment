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
        
        public string BackToExperiencesLink = "//div[contains(@class,'navbar-left')]//a[contains(@class,'nav-control')]";

        public string NextExperienceButton = "//div[contains(@class,'experience-header-wrapper')]//a[contains(@class,'next')]";
        public string PreviousExperienceButton = "//div[contains(@class,'experience-header-wrapper')]//a[contains(@class,'previous')]";

    }
}

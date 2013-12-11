using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ShellLinkingModel : ILinkingModel
    {
        public string Logo = "//*[@class = 'header-logo']";
        public string LogoNotActive = "//span[contains(@class,'header-logo')]";
        public string LogoActive = "//a[contains(@class,'header-logo')]";

        public string NavExperiences = "//nav[contains(@class,'top-navigation')]//div[contains(@class,'content-holder')]//*[contains(@class,'top-navigation-item')][1]";
        public string NavObjectives = "//nav[contains(@class,'top-navigation')]//div[contains(@class,'content-holder')]//*[contains(@class,'top-navigation-item')][2]";

        public string HelpButton = "//li[contains(@class,'header-menu-list-item') and contains(@class,'help')]";
        public string HelpCloseButton = "//a[contains(@class,'help-hint-close')]";

        public string ProfileButton = "//li[contains(@class,'header-menu-list-item') and contains(@class,'profile')]";
        public string ProfileEmail = "//li[contains(@class,'header-menu-list-item') and contains(@class,'profile')]//span[contains(@data-bind,'userEmail')]";
        public string SignOutButton = "//li[contains(@class,'sign-out')]//a";

        public string BackButton = "//a[contains(@class,'nav-back-holder')]";

        public string Copyright = "//div[contains(@class,'footer-item pull-left')]//span";
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class UserSettingsLinkingModel : ILinkingModel
    {
        public string SelectLanguage = "//select[@id='selectedLanguage']";
        public string SaveButton = "//button";
        public string Open = "//a[@href='#/user']";
    }
}

using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PublicationListItemLinkingModel : ILinkingModel
    {
        public string Title = ".//div[contains(@class,'experience-brief-title')]";
        public string SelectElement = ".//div[contains(@class,'experience-brief-options-select')]";
        public string OpenElement = ".//div[contains(@class,'experience-brief-options-open')]";
        public string IsSelectedClass = "experience-brief-selected";

        public string BuildElement = ".//div[contains(@class,'experience-brief-options-build')]";
        public string DownloadElement = ".//div[contains(@class,'experience-brief-options-download')]";

        public string ObjectiveCountElement = ".//div[contains(@class,'experience-brief-toolbar-objective-count')]";
    }
}

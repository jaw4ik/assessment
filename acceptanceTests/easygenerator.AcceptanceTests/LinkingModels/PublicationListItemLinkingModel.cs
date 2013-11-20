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
        public string Title = ".//div[contains(@class,'list-item-title')]//span";
        public string SelectElement = ".//div[contains(@class,'list-item-content-holder')]";
        public string OpenElement = ".//div[contains(@class,'open-item-btn')]//a";
        public string IsSelectedClass = "selected";

        public string BuildElement = ".//div[contains(@class,'experience-action create-package')]";
        public string DownloadElement = ".//div[contains(@class,'experience-action download-package')]";
        public string RebuildElement = ".//div[contains(@class,'experience-action create-package')]";

        public string ObjectiveCountElement = ".//div[contains(@class,'experience-brief-toolbar-objective-count')]";

        public string BuildingStatus = ".//div[contains(@class,'experience-status-container')]//div[contains(@class,'experience-text-holder building')]";
        public string CompleteStatus = ".//div[contains(@class,'experience-status-container')]//div[contains(@class,'experience-text-holder complete')]";
        public string FailedStatus = ".//div[contains(@class,'experience-brief-options-failed')]";
        
    }
}

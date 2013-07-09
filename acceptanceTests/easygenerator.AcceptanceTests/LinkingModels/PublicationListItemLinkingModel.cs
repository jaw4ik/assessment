using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PublicationListItemLinkingModel : ILinkinkModel
    {
        public string Title = ".//span[contains(@class,'publication-brief-title-text')]";
        public string SelectElement = ".//div[contains(@class,'publication-brief-select')]";
        public string OpenElement = ".//div[contains(@class,'publication-brief-open')]";
        public string IsSelectedClass = "selected";        
    }
}

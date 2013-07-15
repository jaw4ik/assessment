using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ObjectiveListItemLinkingModel : ILinkingModel
    {
        public string Title = ".//div[contains(@class,'objective-brief-title')]";
        public string SelectElement = ".//div[contains(@class,'objective-brief-options-select')]";
        public string OpenElement = ".//div[contains(@class,'objective-brief-options-open')]";
        public string IsSelectedClass = "objective-brief-selected";
    }
}

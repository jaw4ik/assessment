using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class ObjectiveListItemLinkingModel : ILinkinkModel
    {
        public string Title = ".//span[contains(@class,'objective-brief-title-text')]";

        public string SelectElement = "//Button";
        public string OpenElement = "//Button";
        public string IsSelectedClass = "selected";
    }
}

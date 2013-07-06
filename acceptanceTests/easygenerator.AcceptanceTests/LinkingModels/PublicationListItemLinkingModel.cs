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
        public string Title = ".//span[contains(@class,'alert')]";

        public string OpenElement = "";
        public string IsSelectedClass = "selected";
        public string SelectElement = "";
    }
}

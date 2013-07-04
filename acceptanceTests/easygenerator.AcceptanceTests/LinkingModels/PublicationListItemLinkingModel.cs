using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PublicationListItemLinkingModel : BaseLinkinkModel
    {
        public string Title = ".//span[contains(@class,'alert')]";

        public string OpenElement = "//Button";
        public bool IsSelected(IWebElement el)
        {
            return el.GetAttribute("class").Contains("selected");
        }
    }
}

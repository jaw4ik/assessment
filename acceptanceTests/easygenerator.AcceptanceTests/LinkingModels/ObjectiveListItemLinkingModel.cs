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
        public string Title = ".//div[contains(@class,'list-item-title')]//span";
        public string SelectElement = ".//div[contains(@class,'list-item-content-holder')]";
        public string OpenElement = ".//div[contains(@class,'open-item-btn')]//a";
        public string IsSelectedClass = "selected";
    }
}

using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class QuestionListItemLinkingModel : ILinkingModel
    {
        public string QuestionTitle = ".//div[contains(@class,'list-item-title')]//span";
        public string AddButton = "//div[contains(@class,'create-new-holder')]";
        public string OpenButton = ".//div[contains(@class,'open-item-btn')]//a";
        //public string EditButton = ".//div[contains(@class,'question-edit')]";
        public string SelectElement = ".//div[contains(@class,'list-item-content-holder')]";
        //public string OpenElement = ".//div[contains(@class,'item-options')]//div[contains(@class,'open')]";
        public string SelectedPartClass = "selected";
    }
}

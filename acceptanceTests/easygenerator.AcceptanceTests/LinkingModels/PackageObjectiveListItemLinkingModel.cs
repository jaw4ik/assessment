using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PackageObjectiveListItemLinkingModel : ILinkingModel
    {
        public string Title = ".//div[contains(@class,'objective-brief-title')]";        

        public string ToggleExpandButton = ".//div[contains(@class,'objective-brief')]";
        public string QuestionList = ".//ul[contains(@class,'question-brief-list')]";

        public string QuestionItem = ".//li[contains(@class,'question-brief')]";
        public string QuestionTitle = ".//a[contains(@class,'question-brief-title')]";
        
    }
}

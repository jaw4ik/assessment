using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class PackageObjectiveListLinkingModel : ILinkingModel
    {
        public string ObjectiveItem = ".//li[contains(@class,'objective-brief-list-item')]";
        public string QuestionItem = ".//li[contains(@class,'question-brief')]";
        
        
        
    }
}

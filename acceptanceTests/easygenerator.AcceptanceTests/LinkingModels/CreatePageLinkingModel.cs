using OpenQA.Selenium;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class CreatePageLinkingModel : ILinkingModel
    {
        public string EditTitleTextBlock = ".//div[contains(@class,'text-block')]";
        public string TextBlockEditArea = ".//div[contains(@class,'text-block')]//div[contains(@class,'editarea')]";
        
        public string ButtonCreateAndEdit = ".//*[contains(@class,'saveAndOpen')]";
        public string ButtonCreateAndNew = ".//*[contains(@class,'saveAndNew')]";

        public string BackButton = ".//a[contains(@class,'inline nav-control left')]";

        public string CharsCounter = ".//div[contains(@class,'text-block')]//div[contains(@class,'chars-counter')]";
        public string CharsCount = ".//div[contains(@class,'text-block')]//div[contains(@class,'chars-counter')]//span[1]";
        public string MaxCharsCount = ".//div[contains(@class,'text-block')]//div[contains(@class,'chars-counter')]//span[2]";
        
        //CUD Experience

        public string TemplateSelector = ".//div[contains(@class,'experience-template-selector')]";
        public string DefaultTemplateSelector = ".//div[contains(@class,'experience-template-selector')]//ul//li[1]";
        public string QuizTemplateSelector = ".//div[contains(@class,'experience-template-selector')]//ul//li[2]";
    }
}

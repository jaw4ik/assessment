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
        public string EditTitleTextBlock = ".//form[contains(@class,'create-form')]//div[contains(@class,'edit-field')]";
        public string TextBlockEditArea = ".//form[contains(@class,'create-form')]//div[contains(@class,'edit-field')]";

        public string ButtonCreateAndEdit = ".//*[contains(@class,'btn-create')]";
        public string ButtonCreateAndNew = ".//*[contains(@class,'link-create')]";

        public string BackButton = ".//a[contains(@class,'nav-back-holder')]";

        public string CharsCounter = ".//form[contains(@class,'create-form')]//div[contains(@class,'chars-counter')]";
        public string CharsCount = ".//form[contains(@class,'create-form')]//div[contains(@class,'chars-counter')]//span[1]";
        public string MaxCharsCount = ".//form[contains(@class,'create-form')]//div[contains(@class,'chars-counter')]//span[2]";
        
        //CUD Experience

        public string TemplateSelector = ".//div[contains(@class,'experience-template-selector selectbox')]";
        public string DefaultTemplateSelector = ".//div[contains(@class,'experience-template-selector')]//ul//li[1]";
        public string QuizTemplateSelector = ".//div[contains(@class,'experience-template-selector')]//ul//li[2]";
    }
}

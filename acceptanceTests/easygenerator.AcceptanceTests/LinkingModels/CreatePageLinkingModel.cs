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
        public string TextBlockEditArea = ".//div[contains(@class,'text-block')]//div[contains(@class,'editarea')]";
        public string EditTitleTextBlock = ".//div[contains(@class,'text-block')]";
        public string ButtonCreateAndEdit = ".//*[contains(@class,'saveAndOpen')]";
        public string ButtonCreateAndNew = ".//*[contains(@class,'saveAndNew')]";


    }
}

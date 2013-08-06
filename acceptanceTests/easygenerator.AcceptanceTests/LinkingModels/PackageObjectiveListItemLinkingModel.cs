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
    }
}

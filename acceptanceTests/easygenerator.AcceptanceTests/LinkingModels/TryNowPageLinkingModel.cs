using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class TryNowPageLinkingModel : ILinkingModel
    {
        public string SignInLink = "//a[contains(@class,'account-link-sign-in')]";

    }
}

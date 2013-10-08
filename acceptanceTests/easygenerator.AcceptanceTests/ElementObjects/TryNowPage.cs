using easygenerator.AcceptanceTests.LinkingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.AcceptanceTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Remote;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class TryNowPage : BasePageElement<TryNowPageLinkingModel>
    {
        public TryNowPage() { }

        internal void SignInClick()
        {
            var SignInLink = GetByXPath(model.SignInLink);
            SignInLink.Click();
        }

    }
}

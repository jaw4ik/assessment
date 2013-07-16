using easygenerator.AcceptanceTests.Helpers;
using easygenerator.AcceptanceTests.LinkingModels;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.ElementObjects
{
    public class UserSettingsPage : BasePageElement<UserSettingsLinkingModel>
    {

        internal void Open()
        {
            GetByXPath(model.Open).Click();
        }

        internal void SelectLanguage(string localization)
        {
            var itemsContainer =new SelectElement( GetByXPath(model.SelectLanguage));
            itemsContainer.SelectByText(localization);
        }

        internal void Save()
        {
            GetByXPath(model.SaveButton).Click();
        }
    }
}

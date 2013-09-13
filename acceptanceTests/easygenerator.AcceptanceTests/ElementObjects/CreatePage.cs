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
    public class CreatePage : BasePageElement<CreatePageLinkingModel>
    {
        public CreatePage() { }

        internal void ClearEditArea()
        {
            DriverProvider.Current().Driver.FindElementByXPath(model.TextBlockEditArea).Clear();
        }

        internal void AddNewTitleText(string Text)
        {
            DriverProvider.Current().Driver.FindElementByXPath(model.TextBlockEditArea).SendKeys(Text);
        }

        public bool EditTitleTextBlockIsActive
        {
            get
            {
                return GetByXPath(model.EditTitleTextBlock).CssContains("active"); 
            } 
        }

        public string EditTitleTextBlockText
        {
            get
            {
                return GetByXPath(model.TextBlockEditArea).GetTextContent();
            }
        }



        public bool ButtonCreateAndEditIsEnabled
        {
            get
            {
                return GetByXPath(model.ButtonCreateAndEdit).CssContains("enabled");
            }
        }

        public bool ButtonCreateAndNewIsEnabled
        {
            get
            {
                return GetByXPath(model.ButtonCreateAndNew).CssContains("enabled");
            }
        }

        internal void BackButtonClick()
        {
            var link = GetByXPath(model.BackButton);
            link.Click();
        }

        public string MaxCharsCount
        {
            get
            {
                return GetByXPath(model.MaxCharsCount).GetTextContent();
            }
        }

        public string CharsCount
        {
            get
            {
                return GetByXPath(model.CharsCount).GetTextContent();
            }
        }

        public bool CharsCounterErrorIsShown
        {
            get
            {
                return GetByXPath(model.CharsCounter).CssContains("error");
            }
        }

        public bool TextBlockErrorIsShown
        {
            get
            {
                return GetByXPath(model.EditTitleTextBlock).CssContains("error");
            }
        }


        internal void CreateAndEditButtonClick()
        {
            var link = GetByXPath(model.ButtonCreateAndEdit);
            link.Click();
        }

        internal void CreateAndNewButtonClick()
        {
            var link = GetByXPath(model.ButtonCreateAndNew);
            link.Click();
        }

    }
}

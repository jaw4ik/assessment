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
    public class PackageQuestionPage : BasePageElement<PackageQuestionPageLinkingModel>
    {
        public PackageQuestionPage() { }

        public string PackageQuestionTitle
        {
            get
            {
                var el = GetByXPath(model.PackageQuestionTitle);
                return el.GetTextContent();
            }
        }

        public PackageAnswerItem[] PackageAnswerItems
        {
            get
            {
                var items = GetAllByXPath(model.PackageAnswerItem);
                return items.Select(it => new PackageAnswerItem(it)).ToArray();
            }
        }
        
        internal void SubmitButtonClick()
        {
            GetByXPath(model.SubmitButton).Click();
        }

        internal void ShowExplanationsLinkClick()
        {
            GetByXPath(model.ShowExplanationsLink).Click();
        }

        internal void BackToObjectivesLinkClick()
        {
            GetByXPath(model.BackToObjectivesLink).Click();
        }
        
        internal void ProgressSummaryLinkClick()
        {
            GetByXPath(model.ProgressSummaryLink).Click();
        }

        internal void HomeLinkClick()
        {
            GetByXPath(model.HomeLink).Click();
        }
    }

    public class PackageAnswerItem : ContainerElement<PackageQuestionPageLinkingModel>
    {

        public PackageAnswerItem(RemoteWebElement container)
            : base(container) { }

        public string Text
        {
            get
            {
                var el = GetByXPathInside(model.PackageAnswerItemText);
                return el.GetTextContent();                
            }
        }

        
    }
}

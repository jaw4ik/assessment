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
    public class PackageExplanationsPage : BasePageElement<PackageExplanationsPageLinkingModel>
    {
        public PackageExplanationsPage() { }

        public string[] PackageExplanationItems
        {
            get
            {
                var items = GetAllByXPath(model.PackageExplanation);
                return items.Select(it => it.GetTextContent()).ToArray();
            }
        }



        internal void BackToQuestionLinkClick()
        {
            GetByXPath(model.BackToQuestionLink).Click();
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

    

}

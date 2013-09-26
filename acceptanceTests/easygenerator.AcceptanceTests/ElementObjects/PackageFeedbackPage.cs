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
    public class PackageFeedbackPage : BasePageElement<PackageFeedbackPageLinkingModel>
    {
        public PackageFeedbackPage() { }

        internal bool QuestionProgressScoreIsDisplayed()
        {
            return base.ExistsOnPage(model.QuestionProgressScore);
        }

        public string QuestionProgressScore
        {
            get
            {
                var el = GetByXPath(model.QuestionProgressScore);
                return el.GetTextContent();
            }
        }

        internal void ShowExplanationsButtonClick()
        {
            GetByXPath(model.ShowExplanationsButton).Click();
        }

        internal void TryAgainButtonClick()
        {
            GetByXPath(model.TryAgainButton).Click();
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

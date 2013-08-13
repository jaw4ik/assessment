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
    public class ExperiencePage : BasePageElement<ExperiencePageLinkingModel>
    {
        public ExperiencePage() { }

        public ExpObjectivesListItem[] ObjectiveItems
        {
            get
            {
                var items = GetAllByXPath(model.Item);
                return items.Select(it => new ExpObjectivesListItem(it)).ToArray();
            }
        }

        public ExpObjectivesListItem ItemByTitle(string title)
        {
            return ObjectiveItems.First(it => it.Title == title);
        }

        public string BackToExperiencesLinkText
        {
            get
            {
                var el = GetByXPath(model.BackToExperiencesLink);
                return el.GetTextContent();
            }
        }

        public string ExperienceTitle
        {
            get
            {
                var el = GetByXPath(model.ExperienceTitle);
                return el.GetTextContent();
            }
        }

        internal void NavigateBackToExperiences()
        {
            var link = GetByXPath(model.BackToExperiencesLink);
            link.Click();
        }

        internal void NavigateToNextExperience()
        {
            var link = GetByXPath(model.NextExperienceButton);
            link.Click();            
        }

        internal void NavigateToPreviousExperience()
        {
            var link = GetByXPath(model.PreviousExperienceButton);
            link.Click();
        }

        internal bool IsNextButtonEnabled()
        {
            return base.ExistsOnPage(model.NextExperienceButton);
        }

        internal bool IsPreviousButtonEnabled()
        {
            return base.ExistsOnPage(model.PreviousExperienceButton);
        }

    }
}

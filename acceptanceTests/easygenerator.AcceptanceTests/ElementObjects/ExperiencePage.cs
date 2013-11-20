﻿using easygenerator.AcceptanceTests.LinkingModels;
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

        public string BuildButtonText
        {
            get
            {
                var el = GetByXPath(model.BuildButton);
                return el.GetTextContent();
            }
        }

        public string DownloadButtonText
        {
            get
            {
                var el = GetByXPath(model.DownloadButton);
                return el.GetTextContent();
            }
        }

        public string RebuildButtonText
        {
            get
            {
                var el = GetByXPath(model.RebuildButton);
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


        internal void Build()
        {
            var buildButton = GetByXPath(model.BuildButton);
            buildButton.Click();
        }

        internal void Rebuild()
        {
            var buildButton = GetByXPath(model.RebuildButton);
            buildButton.Click();
        }

        internal void Download()
        {
            var buildButton = GetByXPath(model.DownloadButton);
            buildButton.Click();
        }


        internal void EditExperienceTitleText(string newExperienceTitle)
        {
            var experienceTitle = GetByXPath(model.ExperienceTitle);
            experienceTitle.Click();
            experienceTitle.Clear();
            experienceTitle.SendKeys(newExperienceTitle);
        }

        internal void ClearExperienceTitleText()
        {
            var experienceTitle = GetByXPath(model.ExperienceTitle);
            experienceTitle.Click();
            experienceTitle.Clear();
        }
                
        public bool HeaderTitleTextBlockErrorIsShown
        {
            get
            {
                return GetByXPath(model.ExperienceTitle).CssContains("error");
            }
        }

        public bool CharsCounterErrorIsShown
        {
            get
            {
                return GetByXPath(model.CharsCounter).CssContains("error");
            }
        }

        internal void ExperienceHeaderTitleTextClick()
        {
            GetByXPath(model.ExperienceHeaderTitleText).Click();
        }

        internal void IncludeButtonClick()
        {
            GetByXPath(model.IncludeButton).Click();
        }

        internal void FinishButtonClick()
        {
            GetByXPath(model.FinishButton).Click();
        }
        
        internal void ExcludeButtonClick()
        {
            GetByXPath(model.ExcludeButton).Click();
        }

        public bool ExcludeButtonIsEnabled
        {
            get
            {
                return GetByXPath(model.ExcludeButton).CssContains("enabled");
            }
        }

        public bool IsBuildingStatusDisplayed
        {
            get
            {
                return GetByXPath(model.BuildingStatus).Displayed;
            }
        }

        public bool IsFailedStatusDisplayed
        {
            get
            {
                return GetByXPath(model.FailedStatus).Displayed;
            }
        }

        internal void FailedStatusHover()
        {
            GetByXPath(model.FailedStatus).HoverElement();
        }


        internal void ShowNotConnectedObjectivesClick()
        {
            GetByXPath(model.ShowNotConnectedObjectives).Click();
        }

        internal void ShowConnectedObjectivesClick()
        {
            GetByXPath(model.ShowConnectedObjectives).Click();
        }
    }
}

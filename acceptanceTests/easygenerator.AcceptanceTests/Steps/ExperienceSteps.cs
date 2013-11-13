using easygenerator.AcceptanceTests.ElementObjects;
using easygenerator.AcceptanceTests.Helpers;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace easygenerator.AcceptanceTests.Steps
{
    
    [Binding]
    public class ExperienceSteps
    {
        ExperiencePage experiencePage;
        public ExperienceSteps(ExperiencePage experiencePage)
        {
            this.experiencePage = experiencePage;
        }

        [Then(@"'(.*)' title is shown in experience page header")]
        public void ThenTitleIsShownInExperiencePageHeader(string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() => experiencePage.ExperienceTitle == title, "Incorrect question title, shown title is " + experiencePage.ExperienceTitle);
        }


        [Then(@"related objectives list contains only items with data")]
        public void ThenRelatedObjectivesListContainsOnlyItemsWithData(Table table)
        {
            var expectedObjectives = table.CreateSet<ObjectiveData>().Select(obj => obj.Title).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsTheSame(expectedObjectives, experiencePage.ObjectiveItems.Select(obj => obj.Title).ToArray()),
                "Not all expected objectives on page", experiencePage.ObjectiveItems.Select(obj => obj.Title).ToArray());
        }

        [When(@"mouse hover element of related objectives list with title '(.*)'")]
        public void WhenMouseHoverElementOfRelatedObjectivesListWithTitle(string title)
        {
            var item = experiencePage.ItemByTitle(title);
            item.Hover();
        }

        [Then(@"Action edit is enabled (.*) for related objectives list item with title '(.*)'")]
        public void ThenActionEditIsEnabledTrueForRelatedObjectivesListItemWithTitle(bool isEnabled, string title)
        {
            var item = experiencePage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsEditEnabled,
                "Open should be enabled(disabled)");
        }

        [Then(@"Action select is enabled (.*) for related objectives list item with title '(.*)'")]
        public void ThenActionSelectIsEnabledTrueForRelatedObjectivesListItemWithTitle(bool isEnabled, string title)
        {
            var item = experiencePage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsSelectedEnabled,
                "Select should be enabled(disabled)");
        }

        [Then(@"question count for related objective item with title '(.*)' is '(.*)'")]
        public void ThenQuestionCountForRelatedObjectiveItemWithTitleIs(string title, string questionCount)
        {
            var item = experiencePage.ObjectiveItems.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() => questionCount == item.QuestionCount,
                "Incorrect question count");
        }

        [When(@"click on back to experiences")]
        public void WhenClickOnBackToExperiences()
        {
            experiencePage.NavigateBackToExperiences();
        }

        [When(@"click on next experience")]
        public void WhenClickOnNextExperience()
        {
            experiencePage.NavigateToNextExperience();
        }

        [When(@"click on previous experience")]
        public void WhenClickOnPreviousExperience()
        {
            experiencePage.NavigateToPreviousExperience();
        }

        [Then(@"previous experience action is not available")]
        public void ThenPreviousExperienceActionIsNotAvailable()
        {
            TestUtils.Assert_IsTrue_WithWait(() => !experiencePage.IsPreviousButtonEnabled(), "Previous button is enabled");
        }

        [Then(@"next experience action is not available")]
        public void ThenNextExperienceActionIsNotAvailable()
        {
            TestUtils.Assert_IsTrue_WithWait(() => !experiencePage.IsNextButtonEnabled(), "Next button is enabled");
        }

        [Then(@"related objectives list item with title '(.*)' is selected")]
        public void ThenRelatedObjectivesListItemWithTitleIsSelected(string title)
        {
            var item = experiencePage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                item.IsSelected,
                "Objective should be selected");
        }


        [Then(@"related objectives list item with title '(.*)' is not selected")]
        public void ThenRelatedObjectivesListItemWithTitleIsNotSelected(string title)
        {
            TestUtils.Assert_IsFalse_WithWait(() =>
                experiencePage.ObjectiveItems.First(it => it.Title == title).IsSelected,
                "Objective should not be selected");
        }

        [When(@"select related objective list item with title '(.*)'")]
        public void WhenSelectRelatedObjectiveListItemWithTitle(string title)
        {
            foreach (var item in experiencePage.ObjectiveItems)
            {
                if (item.Title == title)
                {
                    item.Select();
                    return;
                }
            }
            throw new InvalidOperationException("Cannot find objective with given title");
        }

        [When(@"scroll related objective with title '(.*)' into the view")]
        public void WhenScrollRelatedObjectiveWithTitleIntoTheView(string title)
        {
            experiencePage.ItemByTitle(title).ScrollIntoView();
        }

        [Then(@"element of related objectives list with title '(.*)' is visible")]
        public void ThenElementOfRelatedObjectivesListWithTitleIsVisible(string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.ItemByTitle(title).IsVisisble(),
                "Element should be visible");
        }

        [When(@"click open related objective list item with title '(.*)'")]
        public void WhenClickOpenRelatedObjectiveListItemWithTitle(string title)
        {
            experiencePage.ItemByTitle(title).Open();
        }

        [When(@"click on build button")]
        public void WhenClickOnBuildButton()
        {
            experiencePage.Build();
        }

        [When(@"click on rebuild button")]
        public void WhenClickOnRebuildButton()
        {
            experiencePage.Rebuild();
        }

        [When(@"mouse hover failed status element on experience page")]
        public void WhenMouseHoverFailedStatusElementOnExperiencePage()
        {
            experiencePage.FailedStatusHover();
        }



        [Then(@"build action on experiance page is available")]
        public void ThenBuildActionOnExperiancePageIsAvailable()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.BuildButtonText == "Create package",
                "Element should be visible");
        }


        [Then(@"download action on experiance page is available")]
        public void ThenDownloadActionOnExperiancePageIsAvailable()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.DownloadButtonText == "Download",
                "Element should be visible");
        }

        [Then(@"rebuild action on experiance page is available")]
        public void ThenRebuildActionOnExperiancePageIsAvailable()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.RebuildButtonText == "Update package",
                "Element should be visible");
        }

        [Then(@"status building is shown on experience page")]
        public void ThenStatusBuildingIsShownOnExperiencePage()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.IsBuildingStatusDisplayed,
                "Building status should be displayed");
        }

        [Then(@"status failed is shown on experience page")]
        public void ThenStatusFailedIsShownOnExperiencePage()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.IsFailedStatusDisplayed,
                "Failed status should be displayed");
        }




        //CUD Experience

        [Then(@"'(.*)' text is shown in back to experiences list link")]
        public void ThenTextIsShownInBackToExperiencesListLink(string text)
        {
            TestUtils.Assert_IsTrue_WithWait(() => experiencePage.BackToExperiencesLinkText.Contains(text),
                "Incorrect text in back link");
        }

        [When(@"edit experience title with new text '(.*)' on experience page")]
        public void WhenEditExperienceTitleWithNewTextOnExperiencePage(string experienceTitle)
        {
            experiencePage.EditExperienceTitleText(experienceTitle);
        }

        [When(@"clear header title text field on experience page")]
        public void WhenClearHeaderTitleTextFieldOnExperiencePage()
        {
            experiencePage.ClearExperienceTitleText();
        }

        [Then(@"title text block marked with error on experience page")]
        public void ThenTitleTextBlockMarkedWithErrorOnExperiencePage()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.HeaderTitleTextBlockErrorIsShown == true,
                "header title text block is not marked with error");
        }

        [Then(@"chars counter marked with error on experience page")]
        public void ThenCharsCounterMarkedWithErrorOnExperiencePage()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.CharsCounterErrorIsShown == true,
                "chars counter is not marked with error");
        }

        [When(@"click on experience header title text on experience page")]
        public void WhenClickOnExperienceHeaderTitleTextOnExperiencePage()
        {
            experiencePage.ExperienceHeaderTitleTextClick();
        }

        //include objectives

        [When(@"click on include button on experience page")]
        public void WhenClickOnIncludeButtonOnExperiencePage()
        {
            experiencePage.IncludeButtonClick();
        }

        [When(@"click on finish button on experience page")]
        public void WhenClickOnFinishButtonOnExperiencePage()
        {
            experiencePage.FinishButtonClick();
        }

        [When(@"click on exclude button on experience page")]
        public void WhenClickOnExcludeButtonOnExperiencePage()
        {
            experiencePage.ExcludeButtonClick();
            System.Threading.Thread.Sleep(500);
        }

        [Then(@"exclude button is enabled (.*) on experience page")]
        public void ThenExcludeButtonIsEnabledOnExperiencePage(bool isEnabled)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                experiencePage.ExcludeButtonIsEnabled == isEnabled,
                "incorrect exclude button visibility");
        }
          
        
    }
}

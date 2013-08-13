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

        [Then(@"'(.*)' title is shown in experiance page header")]
        public void ThenTitleIsShownInExperiancePageHeader(string title)
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

        [Then(@"Action open is enabled (.*) for related objectives list item with title '(.*)'")]
        public void ThenActionOpenIsEnabledTrueForRelatedObjectivesListItemWithTitle(bool isEnabled, string title)
        {
            var item = experiencePage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsOpenEnabled,
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

        [Then(@"related objectives list item with title '(.*)' is not selected")]
        public void ThenRelatedObjectivesListItemWithTitleIsNotSelected(string title)
        {
            TestUtils.Assert_IsFalse_WithWait(() =>
                experiencePage.ObjectiveItems.First(it => it.Title == title).IsSelected,
                "Objective should not be selected");
        }



    }
}

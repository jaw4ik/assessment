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


    }
}

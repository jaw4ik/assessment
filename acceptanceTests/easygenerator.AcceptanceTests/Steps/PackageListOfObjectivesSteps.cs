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
    public class PackageObjectiveData : UniqueData
    {
        public string Title { get; set; }
    }

    [Binding]
    public class PackageListOfObjectivesSteps
    {
        PackageObjectivesListPage packageObjectivesPage;
        public PackageListOfObjectivesSteps(PackageObjectivesListPage packageObjectivesPage)
        {
            this.packageObjectivesPage = packageObjectivesPage;
        }

        [Then(@"package objectives tiles list contains only items with data")]
        public void ThenPackageObjectivesTilesListContainsOnlyItemsWithData(Table table)
        {
            var expectedObjectives = table.CreateSet<PackageObjectiveData>().Select(obj => obj.Title).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsTheSame(expectedObjectives, packageObjectivesPage.ObjectiveItems.Select(obj => obj.Title).ToArray()),
                "Not all expected package objectives on page", packageObjectivesPage.ObjectiveItems.Select(obj => obj.Title).ToArray());
        }

        [When(@"toggle expand package objective item with title '(.*)'")]
        public void WhenToggleExpandPackageObjectiveItemWithTitle(string title)
        {
            var objItem = packageObjectivesPage.ObjectiveItemByTitle(title);
            objItem.ToggleExpandButtonClick();
        }

        [Then(@"package questions list of objective item with title '(.*)' containes only items with data")]
        public void ThenPackageQuestionsListOfObjectiveItemWithTitleContainesOnlyItemsWithData(string title, Table table)
        {
            var expectedQuestions = table.CreateSet<QuestionData>().Select(obj => obj.Title).ToArray();
            var realQuestions = packageObjectivesPage.ObjectiveQuestionItems(title).Select(obj => obj.Title).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() => TestUtils.AreCollectionsTheSame(expectedQuestions, realQuestions),
                "Not all expected package objectives on page", realQuestions);
        }

        [Then(@"package questions are not displayed")]
        public void ThenPackageQuestionsAreNotDisplayed()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                packageObjectivesPage.QuestionItems.Length == 0,
                "package questions are displayed");            
        }

        [When(@"click on progress summary button on package list of objective page")]
        public void WhenClickOnProgressSummaryButtonOnPackageListOfObjectivePage()
        {
            packageObjectivesPage.ProgressSummaryButtonClick();
        }

        [When(@"click package question list item '(.*)' of '(.*)'")]
        public void WhenClickPackageQuestionListItemOf(string questionTitle, string objectiveTitle)
        {
            packageObjectivesPage.ObjectiveQuestionItems(objectiveTitle).First(question => question.Title == questionTitle).PackageQuestionListItemClick();
        }



    }
}

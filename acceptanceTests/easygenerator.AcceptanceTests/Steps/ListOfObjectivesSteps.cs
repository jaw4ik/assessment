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
    public class ObjectiveData
    {
        public string Title { get; set; }
        public string Id { get; set; }
    }
    [Binding]
    public class ListOfObjectivesSteps
    {
        ObjectivesListPage objectivesPage;
        public ListOfObjectivesSteps(ObjectivesListPage objectivesPage)
        {
            this.objectivesPage = objectivesPage;
        }

        [Given(@"objectives are present in database")]
        public void GivenObjectivesArePresentInDatabase(Table table)
        {
            var objectives = table.CreateSet<ObjectiveData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.EmptyObjectivesList();
            dataSetter.AddObjectivesToDatabase(objectives);
        }

        [Then(@"objectives tiles list contains items with data")]
        public void ThenObjectivesTilesListContainsItemsWithData(Table table)
        {
            var expectedObjectives = table.CreateSet<ObjectiveData>().ToArray();
            var realObjectives = objectivesPage.Items;
            TestUtils.Assert_IsTrue_WithWait(() =>
                expectedObjectives.All(obj => realObjectives.Any(item => item.Title == obj.Title)),
                "Not all expected objectives on page");
        }

        [Then(@"objectives tiles list consists of ordered items")]
        public void ThenObjectivesTilesListConsistsOfOrderedItems(Table table)
        {
            var expectedObjectives = table.CreateSet<ObjectiveData>().Select(obj => obj.Title).ToArray();
            var realObjectives = objectivesPage.Items.Select(obj => obj.Title).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsEqual(expectedObjectives, realObjectives),
                "Order of objectives should be the same");
        }

        [Then(@"objectives list order switch is set to '(.*)'")]
        public void ThenObjectivesListOrderSwitchIsSetTo(string orderString)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                GherkinConstants.OrderWay[orderString] == objectivesPage.Order,
                "Incorrect objectives order switch state");
        }

        [When(@"I switch objectives list order to '(.*)'")]
        public void WhenISwitchObjectivesListOrderTo(string orderString)
        {
            var expectedOrder = GherkinConstants.OrderWay[orderString];
            if (objectivesPage.Order != expectedOrder)
                objectivesPage.Order = expectedOrder;
        }

        [When(@"click on tab publications link on objectives list page")]
        public void WhenClickOnTabPublicationsLinkOnObjectivesListPage()
        {
            objectivesPage.NavigateToPublicationsUsingTabs();
        }

        [When(@"click on objective list item with title '(.*)'")]
        public void WhenClickOnObjectiveListItemWithTitle(string title)
        {
            foreach (var item in objectivesPage.Items)
            {
                if (item.Title == title)
                {
                    item.Click();
                    return;
                }
            }
            throw new InvalidOperationException("Cannot find objective with given title");
        }

        [When(@"mouse hover element of objectives list with title '(.*)'")]
        public void WhenMouseHoverElementOfObjectivesListWithTitle(string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            item.Hover();
        }

        [Then(@"objective list item with title '(.*)' is selected")]
        public void ThenObjectiveListItemWithTitleIsSelected(string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                item.IsSelected,
                "Objective should be selected");
        }

        [Then(@"objective list item with title '(.*)' is not selected")]
        public void ThenObjectiveListItemWithTitleIsNotSelected(string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsFalse_WithWait(() =>
                item.IsSelected,
                "Objective should not be selected");
        }

        [Then(@"objectives list is displayed in (.*) columns")]
        public void ThenObjectivesListIsDisplayedInColumns(int columnsCount)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                columnsCount == objectivesPage.GetColumnsCount(),
                "Incorrect columns count");
        }

        [Then(@"last element of objectives list is visible")]
        public void ThenLastElementOfObjectivesListIsVisible()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                objectivesPage.Items.Last().IsVisisble(),
                "Element should be visible");
        }

        [Then(@"Action open is enabled (.*) for objectives list item with title '(.*)'")]
        public void ThenActionOpenIsEnabledTrueForObjectivesListItemWithTitle(bool isEnabled, string title)
        {
            var item = objectivesPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsOpenEnabled,
                "Open should be enabled");
        }

    }
}

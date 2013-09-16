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
    public class ObjectiveData : UniqueData
    {
        public string Title { get; set; }
    }
    [Binding]
    public class ListOfObjectivesSteps
    {
        ObjectivesListPage objectivesPage;
        public ListOfObjectivesSteps(ObjectivesListPage objectivesPage)
        {
            this.objectivesPage = objectivesPage;
        }

        private Objective BuildObjective(ObjectiveData obj)
        {
            return new Objective()
            {
                Id = obj.Id,
                Title = obj.Title,
                ImageSource = @"Content/images/logo.png",
                CreatedOn = @"\/Date(1377172218190)\/",
                ModifiedOn = @"\/Date(1377172218190)\/",
                Questions = new List<Question>()
            };
        }

        [Given(@"objectives are present in database")]
        public void GivenObjectivesArePresentInDatabase(Table table)
        {
            var objectives = table.CreateSet<ObjectiveData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.AddObjectivesToDatabase(objectives.Select(data => BuildObjective(data)).ToArray());
        }

        [Given(@"objectives are linked to experiance '(.*)'")]
        public void GivenObjectivesAreLinkedToExperiance(string expTitle, Table table)
        {
            var objectives = table.CreateSet<ObjectiveData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.AddObjectivesToExperiance(expTitle, objectives.Select(obj => BuildObjective(obj)).ToArray());
        }

        [Then(@"objectives list page header text is '(.*)'")]
        public void ThenObjectivesListPageHeaderTextIs(string expectedText)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                objectivesPage.Header.ToLower() == expectedText.ToLower(),
                "Text should be set acording to localization, real is " + objectivesPage.Header);
        }

        [Then(@"objectives tiles list contains items with data")]
        public void ThenObjectivesTilesListContainsItemsWithData(Table table)
        {
            var expectedObjectives = table.CreateSet<ObjectiveData>().ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                expectedObjectives.All(obj => objectivesPage.Items.Select(real => real.Title).ToArray().Any(item => item == obj.Title)),
                "Not all expected objectives on page", objectivesPage.Items.Select(obj => obj.Title).ToArray());
        }

        [Then(@"objectives tiles list consists of ordered items")]
        public void ThenObjectivesTilesListConsistsOfOrderedItems(Table table)
        {
            var expectedObjectives = table.CreateSet<ObjectiveData>().Select(obj => obj.Title).ToArray();
            
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsEqual(expectedObjectives, objectivesPage.Items.Select(obj => obj.Title).ToArray()),
                "Order of objectives should be the same", objectivesPage.Items.Select(obj => obj.Title).ToArray());
        }

        [Then(@"objectives list order switch is set to '(.*)'")]
        public void ThenObjectivesListOrderSwitchIsSetTo(string orderString)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                Constants.OrderWay[orderString] == objectivesPage.Order,
                "Incorrect objectives order switch state");
        }

        [When(@"I switch objectives list order to '(.*)'")]
        public void WhenISwitchObjectivesListOrderTo(string orderString)
        {
            var expectedOrder = Constants.OrderWay[orderString];
            if (objectivesPage.Order != expectedOrder)
                objectivesPage.Order = expectedOrder;
        }

        [When(@"click on tab expiriences link on objectives")]
        public void WhenClickOnTabPublicationsLinkOnObjectivesListPage()
        {
            objectivesPage.NavigateToPublicationsUsingTabs();
        }

        [When(@"select objective list item with title '(.*)'")]
        public void WhenClickOnObjectiveListItemWithTitle(string title)
        {
            foreach (var item in objectivesPage.Items)
            {
                if (item.Title == title)
                {
                    item.Select();
                    return;
                }
            }
            throw new InvalidOperationException("Cannot find objective with given title");
        }

        [When(@"mouse hover element of objectives list with title '(.*)'")]
        public void WhenMouseHoverElementOfObjectivesListWithTitle(string title)
        {
            var item = objectivesPage.ItemByTitle(title);
            item.Hover();
        }

        [Then(@"objective list item with title '(.*)' is selected")]
        public void ThenObjectiveListItemWithTitleIsSelected(string title)
        {
            var item = objectivesPage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                item.IsSelected,
                "Objective should be selected");
        }

        [Then(@"objective list item with title '(.*)' is not selected")]
        public void ThenObjectiveListItemWithTitleIsNotSelected(string title)
        {
            var item = objectivesPage.ItemByTitle(title);
            TestUtils.Assert_IsFalse_WithWait(() =>
                item.IsSelected,
                "Objective should not be selected");
        }

        [Then(@"objectives list is displayed in (.*) columns")]
        public void ThenObjectivesListIsDisplayedInColumns(int columnsCount)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                columnsCount == objectivesPage.GetColumnsCount(),
                "Incorrect columns count, real is " + objectivesPage.GetColumnsCount().ToString());
        }
        [When(@"scroll objective with title '(.*)' into the view")]
        public void WhenScrollObjectiveWithTitleIntoTheView(string title)
        {
            objectivesPage.ItemByTitle(title).ScrollIntoView();
        }

        [Then(@"element of objectives list with title '(.*)' is visible")]
        public void ThenElementOfObjectivesListWithTitleIsVisible(string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                objectivesPage.ItemByTitle(title).IsVisisble(),
                "Element should be visible");
        }

        [Then(@"Action open is enabled (.*) for objectives list item with title '(.*)'")]
        public void ThenActionOpenIsEnabledTrueForObjectivesListItemWithTitle(bool isEnabled, string title)
        {
            var item = objectivesPage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsOpenEnabled,
                "Open should be enabled");
        }
        [Then(@"Action select is enabled (.*) for objectives list item with title '(.*)'")]
        public void ThenActionSelectIsEnabledTrueForObjectivesListItemWithTitle(bool isEnabled, string title)
        {
            var item = objectivesPage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsSelectedEnabled,
                "Select should be enabled");
        }

        [When(@"click open objective list item with title '(.*)'")]
        public void WhenClickOpenObjectiveListItemWithTitle(string title)
        {
            objectivesPage.ItemByTitle(title).Open();
        }

        //CUD Objective

        [When(@"press add new objective button on objective list page")]
        public void WhenPressAddNewObjectiveButtonOnObjectiveListPage()
        {
            objectivesPage.ClickAddNewObjectiveButton();
        }

        [Then(@"delete button is displayed (.*) on objectives list page")]
        public void ThenDeleteButtonIsDisplayedOnObjectivesListPage(bool isDisplayed)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                objectivesPage.DeleteButtonIsDisplayed == isDisplayed,
                "incorrect delete button visibility");
        }

        [When(@"click on delete button on objectives list page")]
        public void WhenClickOnDeleteButtonOnObjectivesListPage()
        {
            objectivesPage.DeleteButtonClick();
        }

        
    }
}

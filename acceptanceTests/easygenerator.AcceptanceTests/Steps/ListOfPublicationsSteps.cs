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
    public class PublicationData
    {
        public string Title { get; set; }
        public string Id { get; set; }
    }
    [Binding]
    public class ListOfPublicationsSteps
    {
        PublicationsListPage publicationsPage;
        public ListOfPublicationsSteps(PublicationsListPage publicationsPage)
        {
            this.publicationsPage = publicationsPage;
        }

        [Given(@"publications are present in database")]
        public void GivenPublicationsArePresentInDatabase(Table table)
        {
            var publications = table.CreateSet<PublicationData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.EmptyPublicationsList();
            dataSetter.AddPublicationsToDatabase(publications);
        }

        [Then(@"publications tiles list contains items with data")]
        public void ThenPublicationsTilesListContainsItemsWithData(Table table)
        {
            var expectedPublications = table.CreateSet<PublicationData>().ToArray();
            var realPublications = publicationsPage.Items;
            TestUtils.Assert_IsTrue_WithWait(() =>
                expectedPublications.All(obj => realPublications.Any(item => item.Title == obj.Title)),
                "Not all expected publications on page");
        }

        [Then(@"publications tiles list consists of ordered items")]
        public void ThenPublicationsTilesListConsistsOfOrderedItems(Table table)
        {
            var expectedPublications = table.CreateSet<PublicationData>().Select(obj => obj.Title).ToArray();
            var realPublications = publicationsPage.Items.Select(obj => obj.Title).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsEqual(expectedPublications, realPublications),
                "Order of publications should be the same");
        }

        [Then(@"publications list order switch is set to '(.*)'")]
        public void ThenPublicationsListOrderSwitchIsSetTo(string orderString)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                GherkinConstants.OrderWay[orderString] == publicationsPage.Order,
                "Incorrect publications order switch state");
        }

        [When(@"I switch publications list order to '(.*)'")]
        public void WhenISwitchPublicationsListOrderTo(string orderString)
        {
            var expectedOrder = GherkinConstants.OrderWay[orderString];
            if (publicationsPage.Order != expectedOrder)
                publicationsPage.Order = expectedOrder;
        }

        [When(@"click on publication list item with title '(.*)'")]
        public void WhenClickOnPublicationListItemWithTitle(string title)
        {
            foreach (var item in publicationsPage.Items)
            {
                if (item.Title == title)
                {
                    item.Click();
                    return;
                }
            }
            throw new InvalidOperationException("Cannot find publication with given title");
        }

        [Then(@"publication list item with title '(.*)' is selected")]
        public void ThenPublicationListItemWithTitleIsSelected(string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                item.IsSelected,
                "Publication should be selected");
        }

        [Then(@"publication list item with title '(.*)' is not selected")]
        public void ThenPublicationListItemWithTitleIsNotSelected(string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsFalse_WithWait(() =>
                item.IsSelected,
                "Publication should not be selected");
        }
                
        [Then(@"publications list is displayed in (.*) columns")]
        public void ThenPublicationsListIsDisplayedInColumns(int columnsCount)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                columnsCount == publicationsPage.GetColumnsCount(),
                "Incorrect columns count");
        }

        [Then(@"last element of publications list is visible")]
        public void ThenLastElementOfPublicationsListIsVisible()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                publicationsPage.Items.Last().IsVisisble(),
                "Element should be visible");
        }

        [When(@"mouse hover element of publications list with title '(.*)'")]
        public void WhenMouseHoverElementOfPublicationsListWithTitle(string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            item.Hover();
        }

        [Then(@"Action open is enabled (.*) for publications list item with title '(.*)'")]
        public void ThenActionOpenIsEnabledTrueForPublicationsListItemWithTitle(bool isEnabled, string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsOpenEnabled,
                "Open should be enabled");
        }

        [Then(@"Action select is enabled true for publications list item with title '(.*)'")]
        public void ThenActionSelectIsEnabledTrueForPublicationsListItemWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

    }
}

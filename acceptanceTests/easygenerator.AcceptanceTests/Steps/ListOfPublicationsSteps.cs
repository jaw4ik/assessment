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
        Dictionary<string, Order> orderWay = new Dictionary<string, Order>()
        {
            {"ascending", Order.Ascending},
            {"descending", Order.Descending}
        };
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
            Assert.IsTrue(expectedPublications.All(obj => realPublications.Any(item => item.Title == obj.Title)));
        }

        [Then(@"publications tiles list consists of ordered items")]
        public void ThenPublicationsTilesListConsistsOfOrderedItems(Table table)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"publications list order switch is set to '(.*)'")]
        public void ThenPublicationsListOrderSwitchIsSetTo(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"I switch publications list order to '(.*)'")]
        public void WhenISwitchPublicationsListOrderTo(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on publication list item with title '(.*)'")]
        public void WhenClickOnPublicationListItemWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"publication list item with title '(.*)' is selected")]
        public void ThenPublicationListItemWithTitleIsSelected(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"publication list item with title '(.*)' is not selected")]
        public void ThenPublicationListItemWithTitleIsNotSelected(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Given(@"publications are present in database")]
        public void GivenPublicationsArePresentInDatabase()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"publications list is displayed in (.*) columns")]
        public void ThenPublicationsListIsDisplayedInColumns(int p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"last element of publications list is visible")]
        public void ThenLastElementOfPublicationsListIsVisible()
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"mouse hover element of publications list with title '(.*)'")]
        public void WhenMouseHoverElementOfPublicationsListWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"Action open is enabled true for publications list item with title '(.*)'")]
        public void ThenActionOpenIsEnabledTrueForPublicationsListItemWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"Action select is enabled true for publications list item with title '(.*)'")]
        public void ThenActionSelectIsEnabledTrueForPublicationsListItemWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

    }
}

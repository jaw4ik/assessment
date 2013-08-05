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
    public class ExpirienceData : UniqueData
    {
        public string Title { get; set; }
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
            var publications = table.CreateSet<ExpirienceData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.AddPublicationsToDatabase(publications.Select(data => BuildExpirience(data)).ToArray());
        }
        [Then(@"publications tiles list contains items with data")]
        public void ThenPublicationsTilesListContainsItemsWithData(Table table)
        {
            var expectedPublications = table.CreateSet<ExpirienceData>().ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                expectedPublications.All(obj => publicationsPage.Items.Select(pub => pub.Title).ToArray().Any(item => item == obj.Title)),
                "Not all expected publications on page", publicationsPage.Items.Select(pub => pub.Title).ToArray());
        }

        [Then(@"publications tiles list consists of ordered items")]
        public void ThenPublicationsTilesListConsistsOfOrderedItems(Table table)
        {
            var expectedPublications = table.CreateSet<ExpirienceData>().Select(obj => obj.Title).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsEqual(expectedPublications, publicationsPage.Items.Select(pub => pub.Title).ToArray()),
                "Order of publications should be the same", publicationsPage.Items.Select(pub => pub.Title).ToArray());
        }

        [Then(@"publications list order switch is set to '(.*)'")]
        public void ThenPublicationsListOrderSwitchIsSetTo(string orderString)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                Constants.OrderWay[orderString] == publicationsPage.Order,
                "Incorrect publications order switch state");
        }

        [When(@"I switch publications list order to '(.*)'")]
        public void WhenISwitchPublicationsListOrderTo(string orderString)
        {
            var expectedOrder = Constants.OrderWay[orderString];
            if (publicationsPage.Order != expectedOrder)
                publicationsPage.Order = expectedOrder;
        }

        [When(@"select publication list item with title '(.*)'")]
        public void WhenClickOnPublicationListItemWithTitle(string title)
        {
            foreach (var item in publicationsPage.Items)
            {
                if (item.Title == title)
                {
                    item.Select();
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
                "Incorrect columns count, real is" + publicationsPage.GetColumnsCount().ToString());
        }
        [When(@"scroll publication with title '(.*)' into the view")]
        public void WhenScrollPublicationWithTitleIntoTheView(string title)
        {
            publicationsPage.ItemByTitle(title).ScrollIntoView();
        }

        [Then(@"element with title '(.*)' of publications list is visible")]
        public void ThenLastElementOfPublicationsListIsVisible(string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                publicationsPage.Items.First(it => it.Title == title).IsVisisble(),
                "Element should be visible");
        }

        [When(@"mouse hover element of publications list with title '(.*)'")]
        public void WhenMouseHoverElementOfPublicationsListWithTitle(string title)
        {
            var item = publicationsPage.ItemByTitle(title);
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

        [Then(@"Action select is enabled (.*) for publications list item with title '(.*)'")]
        public void ThenActionSelectIsEnabledTrueForPublicationsListItemWithTitle(bool isEnabled, string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsSelectEnabled,
                "Select should be enabled");
        }

        [Then(@"Action build is enabled (.*) for publications list item with title '(.*)'")]
        public void ThenActionBuildIsEnabledForPublicationsListItemWithTitle(bool isEnabled, string title)
        {
            var item = publicationsPage.Items.First(it => it.Title == title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isEnabled = item.IsBuildEnabled,
                "Build should be enabled");
        }

        [When(@"unzip puckage to tmp")]
        public void WhenUnzipPuckageToTmp()
        {
            string zipPath = @"\\eg-d-web02\Shared\Download\Default.zip";
            string extractPath = @"\\eg-d-web02\Shared\TestCourse\tmp";

            if (System.IO.Directory.Exists(extractPath))
            {
                System.IO.Directory.Delete(extractPath, true);
            }
            System.IO.Compression.ZipFile.ExtractToDirectory(zipPath, extractPath);

            //tmp
            //System.Threading.Thread.Sleep(3000);
        }

        [When(@"sleep")]
        public void WhenSleep()
        {
            System.Threading.Thread.Sleep(3000);
        }


        [When(@"click open publication list item with title '(.*)'")]
        public void WhenClickOpenPublicationListItemWithTitle(string title)
        {
            publicationsPage.ItemByTitle(title).Open();
        }
        [When(@"click on tab objectives link on expiriences list page")]
        public void WhenClickOnTabObjectivesLinkOnExpiriencesListPage()
        {
            publicationsPage.NavigateToObjectivesUsingTabs();
        }

        Expirience BuildExpirience(ExpirienceData data)
        {
            return new Expirience()
            {
                Id = data.Id,
                Title = data.Title
            };
        }

    }
}

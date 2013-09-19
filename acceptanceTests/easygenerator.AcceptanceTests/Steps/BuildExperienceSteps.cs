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
    public class BuildExperienceSteps
    {
        PublicationsListPage publicationsPage;
        public BuildExperienceSteps(PublicationsListPage publicationsPage)
        {
            this.publicationsPage = publicationsPage;
        }

        [Then(@"status building is shown for publication list item with title '(.*)' on click build")]
        public void ThenStatusBuildingIsShownForPublicationListItemWithTitleOnClickBuild(string title)
        {
            var item = publicationsPage.ItemByTitle(title);
            item.Hover();            
            if (TestUtils.WaitForCondition((() => item.IsBuildEnabled), 500))
            {
                item.Build();
            }
            TestUtils.Assert_IsTrue_WithWait(() =>
                item.IsBuildingStatusDisplayed,
                "Building status should be displayed");
        }

        [Then(@"status building is shown for publication list item with title '(.*)' on click rebuild")]
        public void ThenStatusBuildingIsShownForPublicationListItemWithTitleOnClickRebuild(string title)
        {
            var item = publicationsPage.ItemByTitle(title);
            item.Hover();
            if (TestUtils.WaitForCondition((() => item.IsRebuildEnabled), 500))
            {
                item.Rebuild();
            }
            TestUtils.Assert_IsTrue_WithWait(() =>
                item.IsBuildingStatusDisplayed,
                "Building status should be displayed");

        }


        [Then(@"status complete is shown (.*) for publication list item with title '(.*)' after build finished")]
        public void ThenStatusCompleteIsShownForPublicationListItemWithTitleAfterBuildFinished(bool isDisplayed, string title)
        {
            var item = publicationsPage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isDisplayed == item.IsCompleteStatusDisplayed,
                "Complete status should be displayed 10 seconds");
        }

        
        [Then(@"status failed is shown (.*) for publication list item with title '(.*)' after build finished")]
        public void ThenStatusFailedIsShownForPublicationListItemWithTitleAfterBuildFinished(bool isDisplayed, string title)
        {
            var item = publicationsPage.ItemByTitle(title);
            TestUtils.Assert_IsTrue_WithWait(() =>
                isDisplayed == item.IsFailedStatusDisplayed,
                "Failed status should be displayed 10 seconds");
        }


    }
}

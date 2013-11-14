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
    public class ObjectiveScoreData
    {
        public string Title { get; set; }
        public string Value { get; set; }
        public string MeterValue { get; set; }
    }

    [Binding]
    public class PackageSummaryPageSteps
    {
        PackageSummaryPage PackageSummary;
        public PackageSummaryPageSteps(PackageSummaryPage PackageSummary)
        {
            this.PackageSummary = PackageSummary;
        }

        [Then(@"overall progress score '(.*)' is shown on package summary page")]
        public void ThenOverallProgressScoreIsShownOnPackageSummaryPage(string overallScore)
        {
            var expectedScore = overallScore;
            var realScore = PackageSummary.OverallProgressScore;
            TestUtils.Assert_IsTrue_WithWait(() => (realScore == expectedScore), "Incorrect overall progress score is shown: " + realScore);
        }

        [Then(@"objective progress list contains items with data")]
        public void ThenObjectiveProgressListContainsItemsWithData(Table table)
        {
            var expectedData = table.CreateSet<ObjectiveScoreData>();            
            var realData = PackageSummary.ObjectiveProgressItems;


            var expectedTitles = expectedData.Select(obj => obj.Title).ToArray();
            var realTitles = realData.Select(obj => obj.Title).ToArray();

            var expectedValues = expectedData.Select(obj => obj.Value).ToArray();
            var realValues = realData.Select(obj => obj.Value).ToArray();

            var expectedMeterValues = expectedData.Select(obj => obj.MeterValue).ToArray();
            var realMeterValues = realData.Select(obj => obj.MeterValue).ToArray();

            TestUtils.Assert_IsTrue_WithWait(() =>
                (TestUtils.AreCollectionsEqual(expectedTitles,realTitles) &&
                TestUtils.AreCollectionsEqual(expectedValues,realValues) &&
                TestUtils.AreCollectionsEqual(expectedMeterValues,realMeterValues)),
                "incorrect objective scores are shown");
        }

        [When(@"click on back link on progress summary page")]
        public void WhenClickOnBackLinkOnProgressSummaryPage()
        {
            PackageSummary.BackLinkClick();
        }

        [When(@"click on finish link on progress summary page")]
        public void WhenClickOnFinishLinkOnProgressSummaryPage()
        {
            PackageSummary.FinishLinkClick();
        }

        [Then(@"thank you popup appears on package summary page")]
        public void ThenThankYouPopupAppearsOnPackageSummaryPage()
        {
            System.Threading.Thread.Sleep(1000);
            TestUtils.Assert_IsTrue_WithWait(() => PackageSummary.isAlertPresent() == true, "thank you alert doesn't appear");
        }

        [When(@"click on home link on progress summary page")]
        public void WhenClickOnHomeLinkOnProgressSummaryPage()
        {
            PackageSummary.HomeLinkClick();
        }


    }
}

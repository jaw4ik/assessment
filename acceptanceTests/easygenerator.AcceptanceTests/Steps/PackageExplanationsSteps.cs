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
    public class PackageExplanationsSteps
    {
        PackageExplanationsPage PackageExplanations;
        public PackageExplanationsSteps(PackageExplanationsPage PackageExplanations)
        {
            this.PackageExplanations = PackageExplanations;
        }

        [Then(@"package explanations list contains only items with data")]
        public void ThenPackageExplanationsListContainsOnlyItemsWithData(Table table)
        {
            var expectedExplanations = table.CreateSet<ExplanationData>().Select(obj => obj.Explanation).ToArray();
            var realExplanations = PackageExplanations.PackageExplanationItems;
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsTheSame(expectedExplanations, realExplanations),
                "Not all expected explanations on page", realExplanations);
        }

        [When(@"click on back to question link on package explanations page")]
        public void WhenClickOnBackToQuestionLinkOnPackageExplanationsPage()
        {
            PackageExplanations.BackToQuestionLinkClick();
        }

        [When(@"click on back to objectives link on package explanations page")]
        public void WhenClickOnBackToObjectivesLinkOnPackageExplanationsPage()
        {
            PackageExplanations.BackToObjectivesLinkClick();
        }

        [When(@"click on progress summary link on package explanations page")]
        public void WhenClickOnProgressSummaryLinkOnPackageExplanationsPage()
        {
            PackageExplanations.ProgressSummaryLinkClick();
        }

        [When(@"click home link on package explanations page")]
        public void WhenClickHomeLinkOnPackageExplanationsPage()
        {
            PackageExplanations.HomeLinkClick();
        }

    }
}

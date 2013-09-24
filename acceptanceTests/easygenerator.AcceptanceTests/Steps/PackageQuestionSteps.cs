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
    public class PackageQuestionSteps
    {
        PackageQuestionPage PackageQuestion;
        public PackageQuestionSteps(PackageQuestionPage PackageQuestion)
        {
            this.PackageQuestion = PackageQuestion;
        }

        [Then(@"package answer options list contains only items with data")]
        public void ThenPackageAnswerOptionsListContainsOnlyItemsWithData(Table table)
        {
            var expectedAnswers = table.CreateSet<AnswerData>().Select(obj => obj.Text).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsTheSame(expectedAnswers, PackageQuestion.PackageAnswerItems.Select(obj => obj.Text).ToArray()),
                "Not all expected answers on page", PackageQuestion.PackageAnswerItems.Select(obj => obj.Text).ToArray());
        }

        [Then(@"package question title '(.*)' is shown on package question page")]
        public void ThenPackageQuestionTitleIsShownOnPackageQuestionPage(string questionTitle)
        {
            var expectedTitle = questionTitle;
            var realTitle = PackageQuestion.PackageQuestionTitle;
            TestUtils.Assert_IsTrue_WithWait(() => (realTitle == expectedTitle), "Incorrect question title shown");
        }

        [When(@"click on submit button on package question page")]
        public void WhenClickOnSubmitButtonOnPackageQuestionPage()
        {
            PackageQuestion.SubmitButtonClick();
        }

        [When(@"click on show explanations link on package question page")]
        public void WhenClickOnShowExplanationsLinkOnPackageQuestionPage()
        {
            PackageQuestion.ShowExplanationsLinkClick();
        }

        [When(@"click on back to objectives link on package question page")]
        public void WhenClickOnBackToObjectivesLinkOnPackageQuestionPage()
        {
            PackageQuestion.BackToObjectivesLinkClick();
        }

        [When(@"click on progress summary link on package question page")]
        public void WhenClickOnProgressSummaryLinkOnPackageQuestionPage()
        {
            PackageQuestion.ProgressSummaryLinkClick();
        }

        [When(@"click home link on package question page")]
        public void WhenClickHomeLinkOnPackageQuestionPage()
        {
            PackageQuestion.HomeLinkClick();
        }


    }
}

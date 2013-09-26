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
    public class PackageFeedbackPageSteps
    {
        PackageFeedbackPage PackageFeedback;
        public PackageFeedbackPageSteps(PackageFeedbackPage PackageFeedback)
        {
            this.PackageFeedback = PackageFeedback;
        }

        [Then(@"question progress score '(.*)' is shown on package feedback page")]
        public void ThenQuestionProgressScoreIsShownOnPackageFeedbackPage(string questionScore)
        {
            var expectedScore = questionScore;
            var realScore = PackageFeedback.QuestionProgressScore;
            TestUtils.Assert_IsTrue_WithWait(() => (realScore == expectedScore), "Incorrect question score is shown: " + realScore);
        }

        [When(@"click on show explanations button on package feedback page")]
        public void WhenClickOnShowExplanationsButtonOnPackageFeedbackPage()
        {
            PackageFeedback.ShowExplanationsButtonClick();
        }

        [When(@"click on try again button on package feedback page")]
        public void WhenClickOnTryAgainButtonOnPackageFeedbackPage()
        {
            PackageFeedback.TryAgainButtonClick();
        }

        [When(@"click on back to objectives link on package feedback page")]
        public void WhenClickOnBackToObjectivesLinkOnPackageFeedbackPage()
        {
            PackageFeedback.BackToObjectivesLinkClick();
        }

        [When(@"click on progress summary link on package feedback page")]
        public void WhenClickOnProgressSummaryLinkOnPackageFeedbackPage()
        {
            PackageFeedback.ProgressSummaryLinkClick();
        }

        [When(@"click on home link on package feedback page")]
        public void WhenClickOnHomeLinkOnPackageFeedbackPage()
        {
            PackageFeedback.HomeLinkClick();
        }


    }
}

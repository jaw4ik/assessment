﻿using easygenerator.AcceptanceTests.ElementObjects;
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
    public class AnswerData : UniqueData
    {
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
    public class ExplanationData : UniqueData
    {
        public string Explanation { get; set; }
    }

    [Binding]
    public class QuestionSteps
    {
        QuestionPage Question;
        public QuestionSteps(QuestionPage Question)
        {
            this.Question = Question;
        }

        [Given(@"answer options related to '(.*)' of '(.*)' are present in database")]
        public void GivenAnswerOptionsRelatedToOfArePresentInDatabase(string questionTitle, string objTitle, Table table)
        {
            var answers = table.CreateSet<AnswerData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.AddAnswerOptionsToDatabase(objTitle, questionTitle, answers.Select(ans => BuildAnswerOption(ans)).ToArray());
        }
        [Given(@"explanations related to '(.*)' of '(.*)' are present in database")]
        public void GivenExplanationsRelatedToOfArePresentInDatabase(string questionTitle, string objTitle, Table table)
        {
            var explanations = table.CreateSet<ExplanationData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.AddExplanationsToDatabase(objTitle, questionTitle, explanations.Select(exp => BuildExplanation(exp)).ToArray());
        }
        [Then(@"answer options list contains only items with data")]
        public void ThenAnswerOptionsListContainsOnlyItemsWithData(Table table)
        {
            var expectedAnswers = table.CreateSet<AnswerData>().Select(obj => obj.Text).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsTheSame(expectedAnswers, Question.AnswerItems.Select(obj => obj.Text).ToArray()),
                "Not all expected answers on page", Question.AnswerItems.Select(obj => obj.Text).ToArray());
        }

        [Then(@"explanations list contains only items with data")]
        public void ThenExplanationsListContainsOnlyItemsWithData(Table table)
        {
            var expectedExplanations = table.CreateSet<ExplanationData>().Select(obj => obj.Explanation).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsTheSame(expectedExplanations, Question.ExplanationItems.Select(obj => obj.Explanation).ToArray()),
                "Not all expected answers on page", Question.ExplanationItems.Select(obj => obj.Explanation).ToArray());
        }


        [Then(@"'(.*)' title is shown in back to objective link")]
        public void ThenTitleIsShownInBackToObjectiveLink(string Title)
        {
            TestUtils.Assert_IsTrue_WithWait(() => Question.BackToObjectiveLinkText.Contains(Title), "Incorrect objective title in back link, link text is " + backText);
        }

        [Then(@"'(.*)' title is shown in question page header")]
        public void ThenTitleIsShownInQuestionPageHeader(string Title)
        {
            TestUtils.Assert_IsTrue_WithWait(() => Question.QuestionTitle == Title, "Incorrect question title, shown title is " + Question.QuestionTitle);
        }

        [Then(@"correct is set to true for '(.*)'")]
        public void ThenCorrectIsSetToTrueFor(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"correct is set to false for '(.*)'")]
        public void ThenCorrectIsSetToFalseFor(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on next question")]
        public void WhenClickOnNextQuestion()
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on previous question")]
        public void WhenClickOnPreviousQuestion()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"previous question action is not available")]
        public void ThenPreviousQuestionActionIsNotAvailable()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"next question action is not available")]
        public void ThenNextQuestionActionIsNotAvailable()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"answer options block is expanded")]
        public void ThenAnswerOptionsBlockIsExpanded()
        {
            TestUtils.Assert_IsTrue_WithWait(() => Question.AnswersBlockIsExpanded, "Answer options block is not expanded");
        }

        [Then(@"explanations block is expanded")]
        public void ThenExplanationsBlockIsExpanded()
        {
            TestUtils.Assert_IsTrue_WithWait(() => Question.ExplanationsBlockIsExpanded, "Explanations block is not expanded");
        }

        [When(@"click on collapse answer options")]
        public void WhenClickOnCollapseAnswerOptions()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"answer options block is collapsed")]
        public void ThenAnswerOptionsBlockIsCollapsed()
        {
            TestUtils.Assert_IsTrue_WithWait(() => !Question.AnswersBlockIsExpanded, "Answer options block is not collapsed");
        }

        [When(@"click on collapse explanations")]
        public void WhenClickOnCollapseExplanations()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"explanations block is collapsed")]
        public void ThenExplanationsBlockIsCollapsed()
        {
            TestUtils.Assert_IsTrue_WithWait(() => !Question.ExplanationsBlockIsExpanded, "Explanations block is not collapsed");
        }

        [When(@"click on expand answer options")]
        public void WhenClickOnExpandAnswerOptions()
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on expand explanations options")]
        public void WhenClickOnExpandExplanationsOptions()
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on back to objective")]
        public void WhenClickOnBackToObjective()
        {
            Question.NavigateBackToObjective();
        }
        private easygenerator.AcceptanceTests.Helpers.AnswerOption BuildAnswerOption(AnswerData data)
        {
            return new Helpers.AnswerOption()
            {
                IsCorrect = data.IsCorrect,
                Text = data.Text,
                Id = data.Id
            };
        }
        Helpers.Explanation BuildExplanation(ExplanationData data)
        {
            return new Helpers.Explanation()
            {
                Id = data.Id,
                Text = data.Explanation
            };
        }

    }
}

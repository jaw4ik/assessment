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
    public class AnswerData
    {
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
    public class ExplanationData
    {
        public string explanation { get; set; }
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
            dataSetter.EmptyAnswerOptionsOfQuestion(objTitle, questionTitle);
            dataSetter.AddAnswerOptionsToDatabase(objTitle, questionTitle, answers);

        }

        [Given(@"explanations related to '(.*)' of '(.*)' are present in database")]
        public void GivenExplanationsRelatedToOfArePresentInDatabase(string p0, string p1, Table table)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"answer options list contains only items with data")]
        public void ThenAnswerOptionsListContainsOnlyItemsWithData(Table table)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"explanations list contains only items with data")]
        public void ThenExplanationsListContainsOnlyItemsWithData(Table table)
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"navigate to '(.*)' of '(.*)'")]
        public void WhenNavigateToOf(string p0, string p1)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"'(.*)' title is shown in back to objective link")]
        public void ThenTitleIsShownInBackToObjectiveLink(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"'(.*)' title is shown in question page header")]
        public void ThenTitleIsShownInQuestionPageHeader(string p0)
        {
            ScenarioContext.Current.Pending();
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
            ScenarioContext.Current.Pending();
        }

        [Then(@"explanations block is expanded")]
        public void ThenExplanationsBlockIsExpanded()
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on collapse answer options")]
        public void WhenClickOnCollapseAnswerOptions()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"answer options block is collapsed")]
        public void ThenAnswerOptionsBlockIsCollapsed()
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on collapse explanations")]
        public void WhenClickOnCollapseExplanations()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"explanations block is collapsed")]
        public void ThenExplanationsBlockIsCollapsed()
        {
            ScenarioContext.Current.Pending();
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
            ScenarioContext.Current.Pending();
        }

    }
}

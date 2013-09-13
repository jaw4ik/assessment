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

        private AnswerOption BuildAnswerOption(AnswerData data)
        {
            return new Helpers.AnswerOption()
            {
                IsCorrect = data.IsCorrect,
                Text = data.Text,
                Id = data.Id
            };
        }

        private Explanation BuildExplanation(ExplanationData data)
        {
            return new Helpers.Explanation()
            {
                Id = data.Id,
                Text = data.Explanation
            };
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
            var realExplanations = Question.ExplanationItems.Select(obj => obj.Explanation).ToArray();
            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsTheSame(expectedExplanations, realExplanations),
                "Not all expected answers on page", realExplanations);
        }


        [Then(@"'(.*)' title is shown in back to objective link")]
        public void ThenTitleIsShownInBackToObjectiveLink(string Title)
        {
            TestUtils.Assert_IsTrue_WithWait(() => Question.BackToObjectiveLinkText.Contains(Title),
                "Incorrect objective title in back link, link text is " + Question.BackToObjectiveLinkText);
        }

        [Then(@"'(.*)' title is shown in question page header")]
        public void ThenTitleIsShownInQuestionPageHeader(string Title)
        {
            TestUtils.Assert_IsTrue_WithWait(() => Question.QuestionTitle == Title, "Incorrect question title, shown title is " + Question.QuestionTitle);
        }

        [Then(@"correct answer option is set to '(.*)' for '(.*)'")]
        public void ThenCorrectAnswerOptionIsSetToTrueFor( bool Correct, string Text)
        {
            TestUtils.Assert_IsTrue_WithWait(() => Correct == Question.AnswerItems.First(item => item.Text == Text).IsCorrect, "Answer is not marked as expected");
        }

        [When(@"click on next question")]
        public void WhenClickOnNextQuestion()
        {
            Question.NavigateToNextQuestion();
        }

        [When(@"click on previous question")]
        public void WhenClickOnPreviousQuestion()
        {
            Question.NavigateToPreviousQuestion();
        }

        [Then(@"previous question action is not available")]
        public void ThenPreviousQuestionActionIsNotAvailable()
        {
            TestUtils.Assert_IsTrue_WithWait(() => !Question.IsPreviousButtonEnabled(), "Previous button is enabled");
        }

        [Then(@"next question action is not available")]
        public void ThenNextQuestionActionIsNotAvailable()
        {
            TestUtils.Assert_IsTrue_WithWait(() => !Question.IsNextButtonEnabled(), "Next button is enabled");
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
            Question.ToggleAnswerOptions();
        }

        [Then(@"answer options block is collapsed")]
        public void ThenAnswerOptionsBlockIsCollapsed()
        {
            TestUtils.Assert_IsTrue_WithWait(() => !Question.AnswersBlockIsExpanded, "Answer options block is not collapsed");
        }

        [When(@"click on collapse explanations")]
        public void WhenClickOnCollapseExplanations()
        {
            Question.ToggleExplanations();
        }

        [Then(@"explanations block is collapsed")]
        public void ThenExplanationsBlockIsCollapsed()
        {
            TestUtils.Assert_IsTrue_WithWait(() => !Question.ExplanationsBlockIsExpanded, "Explanations block is not collapsed");
        }

        [When(@"click on expand answer options")]
        public void WhenClickOnExpandAnswerOptions()
        {
            Question.ToggleAnswerOptions();
        }

        [When(@"click on expand explanations options")]
        public void WhenClickOnExpandExplanationsOptions()
        {
            Question.ToggleExplanations();
        }

        [When(@"click on back to objective on question page")]
        public void WhenClickOnBackToObjectiveOnQuestionPage()
        {
            Question.NavigateBackToObjective();
        }

        [When(@"click on back to objective title on question page")]
        public void WhenClickOnBackToObjectiveTitleOnQuestionPage()
        {
            Question.NavigateBackToObjectiveByObjectiveTitleClick();
        }


        //Answer Options add/edit/delete

        [When(@"click on add answer option button")]
        public void WhenClickOnAddAnswerOptionButton()
        {
            Question.AddNewAnswerOptionButtonClick();
        }

        [When(@"input text '(.*)' into new answer option text field")]
        public void WhenInputTextIntoNewAnswerOptionTextField(string Text)
        {
            Question.AddNewAnswerOptionText(Text);
            System.Threading.Thread.Sleep(100);
        }

        [When(@"input text '(.*)' into answer option text field '(.*)'")]
        public void WhenInputTextIntoAnswerOptionTextField(string newText, string oldText)
        {
            Question.AddAnswerOptionTextIntoExisting(newText, oldText);
            System.Threading.Thread.Sleep(100);
        }


        [When(@"click on correct answer option for '(.*)'")]
        public void WhenClickOnCorrectAnswerOptionFor(string Text)
        {            
            Question.ToggleAnswerOptionCorrectness(Text);
        }

        [When(@"click on correct answer option for active answer")]
        public void WhenClickOnCorrectAnswerOptionForActiveAnswer()
        {
            Question.ToggleActiveAnswerOptionCorrectness();
        }

        [When(@"click on delete answer option '(.*)'")]
        public void WhenClickOnDeleteAnswerOption(string Text)
        {
            Question.AnswerOptionDelete(Text);
        }

        [When(@"mouse hover element of answer options with text '(.*)'")]
        public void WhenMouseHoverElementOfAnswerOptionsWithText(string Text)
        {
            var item = Question.AnswerItemByText(Text);
            item.Hover();
        }

        //Explanations add/edit/delete

        [When(@"input text '(.*)' into new explanation text field")]
        public void WhenInputTextIntoNewExplanationTextField(string Text)
        {
            Question.AddNewExplanationText(Text);            
        }

        [When(@"click on question title")]
        public void WhenClickOnQuestionTitle()
        {
            Question.QuestionTitleClick();            
        }


        [When(@"mouse hover element of explanation with text '(.*)'")]
        public void WhenMouseHoverElementOfExplanationWithText(string Text)
        {
            var item = Question.ExplanationItemByText(Text);
            item.Hover();
        }

        [When(@"click on delete explanation '(.*)'")]
        public void WhenClickOnDeleteExplanation(string Text)
        {
            Question.ExplanationDelete(Text);
        }

        [When(@"input text '(.*)' into explanation text field '(.*)'")]
        public void WhenInputTextIntoExplanationTextField(string newText, string oldText)
        {
            Question.AddExplanationTextIntoExisting(newText, oldText);            
        }

        [Then(@"explanation delete button is enabled (.*) for explanation with text '(.*)'")]
        public void ThenExplanationDeleteButtonIsEnabledForExplanationWithText(bool isEnabled, string text)
        {            
            TestUtils.Assert_IsTrue_WithWait(() =>
                Question.ExplanationItems.First(it => it.Explanation == text).ExplanationDeleteButtonIsEnabled == isEnabled,
                "Incorrect explanation delete button visibility");
        }

        [Then(@"answer option delete button is enabled (.*) for answer option with text '(.*)'")]
        public void ThenAnswerOptionDeleteButtonIsEnabledFalseForAnswerOptionWithText(bool isEnabled, string text)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                Question.AnswerItems.First(it => it.Text == text).AnswerItemDeleteButtonIsEnabled == isEnabled,
                "Incorrect answer option delete button visibility");
        }


        [When(@"click explanation text field '(.*)'")]
        public void WhenClickExplanationTextField(string text)
        {
            Question.ExplanationTextClick(text);
        }

        [When(@"click answer option text field '(.*)'")]
        public void WhenClickAnswerOptionTextField(string text)
        {
            Question.AnswerOptionTextClick(text);
        }


        [When(@"scroll new explanation button into the view")]
        public void WhenScrollNewExplanationButtonIntoTheView()
        {
            Question.NewExplanationButton.ScrollIntoView();
        }

        [Then(@"new explanation button is visible")]
        public void ThenNewExplanationButtonIsVisible()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                Question.NewExplanationButton.IsVisisble(),
                "Element should be visible");
        }

        //CUD Question

        [When(@"click create new question button on question page")]
        public void WhenClickCreateNewQuestionButtonOnQuestionPage()
        {
            Question.CreateNewQuestionButtonClick();
        }

        [When(@"click on create new question text on question page")]
        public void WhenClickOnCreateNewQuestionTextOnQuestionPage()
        {
            Question.CreateNewQuestionTextClick();
        }

        [When(@"click on header title text field on question page")]
        public void WhenClickOnHeaderTitleTextFieldOnQuestionPage()
        {
            Question.HeaderTitleTextFieldClick();
        }

        [When(@"clear header title text field on question page")]
        public void WhenClearHeaderTitleTextFieldOnQuestionPage()
        {
            Question.HeaderTitleTextFieldClear();
        }

        [When(@"edit question title with new text '(.*)' on question page")]
        public void EditQuestionTitleWithNewTextOnQuestionPage(string questionTitle)
        {
            Question.EditQuestionTitleText(questionTitle);
        }

             

    }
}

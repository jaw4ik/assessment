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
    public class QuestionData
    {
        public string Title { get; set; }
        public string Id { get; set; }
    }
    [Binding]
    public class ListOfQuestionsSteps
    {
        QuestionsList questionListPage;
        public ListOfQuestionsSteps(QuestionsList questionListPage)
        {
            this.questionListPage = questionListPage;
        }
        [Given(@"questions related to '(.*)' are present in database")]
        public void GivenQuestionsRelatedToArePresentInDatabase(string objTitle, Table table)
        {
            var questions = table.CreateSet<QuestionData>().ToArray();
            var dataSetter = new DataSetter();
            dataSetter.EmptyQuestionsListOfObjective(objTitle);
            dataSetter.AddQuestionsToDatabase(objTitle, questions);
        }
        [Then(@"questions list contains items with data")]
        public void ThenQuestionsListContainsItemsWithData(Table table)
        {
            var expectedQuestions = table.CreateSet<QuestionData>().ToArray();
            var realQuestions = questionListPage.Items;

            TestUtils.Assert_IsTrue_WithWait(() =>
                expectedQuestions.All(obj => realQuestions.Any(item => item.Title == obj.Title)),
                "All questions should be present on page");
        }

        [Then(@"questions list consists of ordered items")]
        public void ThenQuestionsListConsistsOfOrderedItems(Table table)
        {
            var expectedQuestions = table.CreateSet<QuestionData>().Select(obj => obj.Title).ToArray();
            var realQuestions = questionListPage.Items.Select(obj => obj.Title).ToArray();

            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsEqual(expectedQuestions, realQuestions),
                "Order of questions should be as expected");
        }

        [Then(@"questions list order switch is set to '(.*)'")]
        public void ThenQuestionsListOrderSwitchIsSetTo(string orderString)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                GherkinConstants.OrderWay[orderString] == questionListPage.Order,
                "Question list switch is in incorrect state");
        }

        [When(@"I switch questions list order to '(.*)'")]
        public void WhenISwitchQuestionsListOrderTo(string orderString)
        {
            var expectedOrder = GherkinConstants.OrderWay[orderString];
            if (questionListPage.Order != expectedOrder)
                questionListPage.Order = expectedOrder;
        }


        [Then(@"questions list item with title ''(.*)' is highlited")]
        public void ThenQuestionsListItemWithTitleIsHighlited(string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                questionListPage.Items.First(it => it.Title == title).IsHighLited,
                "Question should be highlited");
        }

        [Then(@"questions list item with title ''(.*)' is not highlited")]
        public void ThenQuestionsListItemWithTitleIsNotHighlited(string title)
        {
            TestUtils.Assert_IsFalse_WithWait(() =>
                questionListPage.Items.First(it => it.Title == title).IsHighLited,
                "Question should not be highlited");
        }

        [When(@"click on questions list item with title '(.*)'")]
        public void WhenClickOnQuestionsListItemWithTitle(string title)
        {
            questionListPage.Items.First(it => it.Title == title).Click();
        }

        [Given(@"answers related to '(.*)' of '(.*)' are present in database")]
        public void GivenAnswersRelatedToOfArePresentInDatabase(string questionTitle, string objectiveTitle, Table table)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"answers list is visible of question with title '(.*)'")]
        public void ThenAnswersListIsVisibleOfQuestionWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"answers list of question '(.*)' contains items with data")]
        public void ThenAnswersListOfQuestionContainsItemsWithData(string p0, Table table)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"questions list item with title '(.*)' is selected")]
        public void ThenQuestionsListItemWithTitleIsSelected(string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                questionListPage.Items.First(it => it.Title == title).IsSelected,
                "Question should be selected");
        }

        [Then(@"questions list item with title '(.*)' is not selected")]
        public void ThenQuestionsListItemWithTitleIsNotSelected(string title)
        {
            TestUtils.Assert_IsFalse_WithWait(() =>
                questionListPage.Items.First(it => it.Title == title).IsSelected,
                "Question should not be selected");
        }

        [Then(@"last element of questions list is visible")]
        public void ThenLastElementOfQuestionsListIsVisible()
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                questionListPage.Items.Last().IsVisible(),
                "Last question should be visible");
        }

        [Then(@"Action add content is enabled (.*) for questions list item with title '(.*)'")]
        public void ThenActionAddContentIsEnabledTrueForQuestionsListItemWithTitle(bool isEnabled, string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                questionListPage.Items.First(it => it.Title == title).AddEnabled,
                "Action add should be enabled");
        }

        [Then(@"Action edit is enabled (.*) for questions list item with title '(.*)'")]
        public void ThenActionEditIsEnabledTrueForQuestionsListItemWithTitle(bool isEnabled, string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                questionListPage.Items.First(it => it.Title == title).EditEnabled,
                "Action edit should be enabled");
        }

        [When(@"mouse hover element of questions list with title '(.*)'")]
        public void WhenMouseHoverElementOfQuestionsListWithTitle(string title)
        {
            questionListPage.Items.First(it => it.Title == title).Hover();
        }

        [When(@"click on edit question with title '(.*)'")]
        public void WhenClickOnEditQuestionWithTitle(string title)
        {
            questionListPage.Items.First(it => it.Title == title).ClickEdit();
        }

        [When(@"click on back from questions list")]
        public void WhenClickOnBackFromQuestionsList()
        {
            questionListPage.ClickBackToObjectives();
        }

    }
}

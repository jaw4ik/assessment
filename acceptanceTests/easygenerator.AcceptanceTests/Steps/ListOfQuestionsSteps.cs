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
    public class QuestionData : UniqueData
    {
        public string Title { get; set; }
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
            dataSetter.AddQuestionsToDatabase(objTitle, questions.Select(quest => BuildQuestion(quest)).ToArray());
        }
        Question BuildQuestion(QuestionData data)
        {
            return new Question()
            {
                Id = data.Id,
                Title = data.Title,
                CreatedOn = @"\/Date(1377172218190)\/",
                ModifiedOn = @"\/Date(1377172218190)\/",
                AnswerOptions = new List<Helpers.AnswerOption>(),
                Explanations = new List<Helpers.Explanation>()
            };
        }
        [Then(@"questions list contains items with data")]
        public void ThenQuestionsListContainsItemsWithData(Table table)
        {
            var expectedQuestions = table.CreateSet<QuestionData>().ToArray();

            TestUtils.Assert_IsTrue_WithWait(() =>
                expectedQuestions.All(obj => questionListPage.Items.Select(quest => quest.Title).ToArray().Any(item => item == obj.Title)),
                "All questions should be present on page", questionListPage.Items.Select(quest => quest.Title).ToArray());
        }

        [Then(@"questions list consists of ordered items")]
        public void ThenQuestionsListConsistsOfOrderedItems(Table table)
        {
            var expectedQuestions = table.CreateSet<QuestionData>().Select(obj => obj.Title).ToArray();

            TestUtils.Assert_IsTrue_WithWait(() =>
                TestUtils.AreCollectionsEqual(expectedQuestions, questionListPage.Items.Select(quest => quest.Title).ToArray()),
                "Order of questions should be as expected", questionListPage.Items.Select(quest => quest.Title).ToArray());
        }

        [Then(@"questions list order switch is set to '(.*)'")]
        public void ThenQuestionsListOrderSwitchIsSetTo(string orderString)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                Constants.OrderWay[orderString] == questionListPage.Order,
                "Question list switch is in incorrect state");
        }

        [When(@"I switch questions list order to '(.*)'")]
        public void WhenISwitchQuestionsListOrderTo(string orderString)
        {
            var expectedOrder = Constants.OrderWay[orderString];
            if (questionListPage.Order != expectedOrder)
                questionListPage.Order = expectedOrder;
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

        [Then(@"Action select is enabled (.*) for questions list item with title '(.*)'")]
        public void ThenActionSelectIsEnabledTrueForQuestionsListItemWithTitle(bool isEnabled, string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                questionListPage.Items.First(it => it.Title == title).SelectEnabled,
                "Action add should be enabled");
        }

        //[Then(@"Action edit is enabled (.*) for questions list item with title '(.*)'")]
        //public void ThenActionEditIsEnabledTrueForQuestionsListItemWithTitle(bool isEnabled, string title)
        //{
        //    TestUtils.Assert_IsTrue_WithWait(() =>
        //        questionListPage.Items.First(it => it.Title == title).EditEnabled,
        //        "Action edit should be enabled");
        //}

        [Then(@"Action open is enabled (.*) for questions list item with title '(.*)'")]
        public void ThenActionOpenIsEnabledTrueForQuestionsListItemWithTitle(bool isEnabled, string title)
        {
            {
                TestUtils.Assert_IsTrue_WithWait(() =>
                    questionListPage.Items.First(it => it.Title == title).OpenEnabled,
                    "Action open should be enabled");
            }
        }


        [When(@"mouse hover element of questions list with title '(.*)'")]
        public void WhenMouseHoverElementOfQuestionsListWithTitle(string title)
        {
            questionListPage.Items.First(it => it.Title == title).Hover();
        }

        //[When(@"click on edit question with title '(.*)'")]
        //public void WhenClickOnEditQuestionWithTitle(string title)
        //{
        //    questionListPage.Items.First(it => it.Title == title).ClickEdit();
        //}

        [When(@"click on open question with title '(.*)'")]
        public void WhenClickOnOpenQuestionWithTitle(string title)
        {
            questionListPage.Items.First(it => it.Title == title).ClickOpen();
        }


        [When(@"click on back from questions list")]
        public void WhenClickOnBackFromQuestionsList()
        {
            questionListPage.ClickBackToObjectives();
        }
        [When(@"scroll questions list item with title '(.*)' into the view")]
        public void WhenScrollQuestionsListItemWithTitleIntoTheView(string title)
        {
            questionListPage.Items.First(it => it.Title == title).ScrollIntoView();
        }

        [Then(@"element with title '(.*)' of questions list is visible")]
        public void ThenElementWithTitleOfQuestionsListIsVisible(string title)
        {
            TestUtils.Assert_IsTrue_WithWait(() =>
                questionListPage.Items.First(it => it.Title == title).IsVisisble(),
                "Element should be visible");
        }
        [When(@"click on select questions list item with title '(.*)'")]
        public void WhenClickOnSelectQuestionsListItemWithTitle(string title)
        {
            questionListPage.Items.First(it => it.Title == title).ClickSelect();
        }


    }
}

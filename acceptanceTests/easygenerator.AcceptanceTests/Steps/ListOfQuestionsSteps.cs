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
            Assert.IsTrue(expectedQuestions.All(obj => realQuestions.Any(item => item.Title == obj.Title)));
        }

        [Then(@"questions list consists of ordered items")]
        public void ThenQuestionsListConsistsOfOrderedItems(Table table)
        {
            var expectedQuestions = table.CreateSet<QuestionData>().Select(obj => obj.Title).ToArray();
            var realQuestions = questionListPage.Items.Select(obj => obj.Title).ToArray();
            CollectionAssert.AreEqual(expectedQuestions, realQuestions);
        }

        [Then(@"questions list order switch is set to '(.*)'")]
        public void ThenQuestionsListOrderSwitchIsSetTo(string orderString)
        {
            Assert.AreEqual(GherkinConstants.OrderWay[orderString], questionListPage.Order);
        }

        [When(@"I switch questions list order to '(.*)'")]
        public void WhenISwitchQuestionsListOrderTo(string orderString)
        {
            var expectedOrder = GherkinConstants.OrderWay[orderString];
            if (questionListPage.Order != expectedOrder)
                questionListPage.Order = expectedOrder;
        }

        [When(@"mouse hover on questions list item with title '(.*)'")]
        public void WhenMouseHoverOnQuestionsListItemWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"questions list item with title ''(.*)' is highlited")]
        public void ThenQuestionsListItemWithTitleIsHighlited(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"questions list item with title ''(.*)' is not highlited")]
        public void ThenQuestionsListItemWithTitleIsNotHighlited(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on questions list item with title '(.*)'")]
        public void WhenClickOnQuestionsListItemWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Given(@"answers related to '(.*)' are present in database")]
        public void GivenAnswersRelatedToArePresentInDatabase(string p0, Table table)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"answers list is visible")]
        public void ThenAnswersListIsVisible()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"answers list contains items with data")]
        public void ThenAnswersListContainsItemsWithData(Table table)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"questions list item with title '(.*)' is selected")]
        public void ThenQuestionsListItemWithTitleIsSelected(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"questions list item with title '(.*)' is not selected")]
        public void ThenQuestionsListItemWithTitleIsNotSelected(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"last element of questions list is visible")]
        public void ThenLastElementOfQuestionsListIsVisible()
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"Action add content is enabled true for questions list item with title '(.*)'")]
        public void ThenActionAddContentIsEnabledTrueForQuestionsListItemWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [Then(@"Action edit is enabled true for questions list item with title '(.*)'")]
        public void ThenActionEditIsEnabledTrueForQuestionsListItemWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"mouse hover element of questions list with title '(.*)'")]
        public void WhenMouseHoverElementOfQuestionsListWithTitle(string p0)
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on edit question")]
        public void WhenClickOnEditQuestion()
        {
            ScenarioContext.Current.Pending();
        }

        [When(@"click on back from questions list")]
        public void WhenClickOnBackFromQuestionsList()
        {
            ScenarioContext.Current.Pending();
        }

    }
}

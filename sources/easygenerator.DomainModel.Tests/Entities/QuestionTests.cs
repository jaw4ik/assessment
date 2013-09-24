using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class QuestionTests
    {
        #region Constructor

        [TestMethod]
        public void Question_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => QuestionObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => QuestionObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => QuestionObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = QuestionObjectMother.Create(title);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.Answers.Should().BeEmpty();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var question = QuestionObjectMother.Create();

            Action action = () => question.UpdateTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var question = QuestionObjectMother.Create();

            Action action = () => question.UpdateTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var question = QuestionObjectMother.Create();

            Action action = () => question.UpdateTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var question = QuestionObjectMother.Create();

            question.UpdateTitle(title);

            question.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = QuestionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateTitle("title");

            question.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region Add answer

        [TestMethod]
        public void AddAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = QuestionObjectMother.Create();

            Action action = () => question.AddAnswer(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswer()
        {
            var question = QuestionObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.AddAnswer(answer);

            question.Answers.Should().NotBeNull().And.HaveCount(1).And.Contain(answer);
        }

        [TestMethod]
        public void AddAnswer_ShouldSetQuestionToAnswer()
        {
            var question = QuestionObjectMother.Create();
            var answer = AnswerObjectMother.Create();

            question.AddAnswer(answer);

            answer.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = QuestionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddAnswer(AnswerObjectMother.Create());

            question.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region Remove answer

        [TestMethod]
        public void RemoveAnswer_ShouldThrowArgumentNullException_WhenAnswerIsNull()
        {
            var question = QuestionObjectMother.Create();

            Action action = () => question.RemoveAnswer(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("answer");
        }

        [TestMethod]
        public void RemoveAnswer_ShouldRemoveAnswer()
        {
            var question = QuestionObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            question.AddAnswer(answer);

            question.RemoveAnswer(answer);
            question.Answers.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUnsetQuestionFromAnswer()
        {
            var question = QuestionObjectMother.Create();
            var answer = AnswerObjectMother.Create();
            answer.Question = question;

            question.RemoveAnswer(answer);

            answer.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveAnswer_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = QuestionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveAnswer(AnswerObjectMother.Create());

            question.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region Add explanation

        [TestMethod]
        public void AddExplanation_ShouldThrowArgumentNullException_WhenExplanationIsNull()
        {
            var question = QuestionObjectMother.Create();

            Action action = () => question.AddExplanation(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("explanation");
        }

        [TestMethod]
        public void AddExplanation_ShouldAddExplanation()
        {
            var question = QuestionObjectMother.Create();
            var explanation = ExplanationObjectMother.Create();

            question.AddExplanation(explanation);

            question.Explanations.Should().NotBeNull().And.HaveCount(1).And.Contain(explanation);
        }

        [TestMethod]
        public void AddExplanation_ShouldSetQuestionToExplanation()
        {
            var question = QuestionObjectMother.Create();
            var explanation = ExplanationObjectMother.Create();

            question.AddExplanation(explanation);

            explanation.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddExplanation_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = QuestionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddExplanation(ExplanationObjectMother.Create());

            question.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region Remove explanation

        [TestMethod]
        public void RemoveExplanation_ShouldThrowArgumentNullException_WhenExplanationIsNull()
        {
            var question = QuestionObjectMother.Create();

            Action action = () => question.RemoveExplanation(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("explanation");
        }

        [TestMethod]
        public void RemoveExplanation_ShouldRemoveExplanation()
        {
            var question = QuestionObjectMother.Create();
            var explanation = ExplanationObjectMother.Create();
            question.AddExplanation(explanation);

            question.RemoveExplanation(explanation);
            question.Explanations.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveExplanation_ShouldUnsetQuestionFromExplanation()
        {
            var question = QuestionObjectMother.Create();
            var explanation = ExplanationObjectMother.Create();
            explanation.Question = question;

            question.RemoveExplanation(explanation);

            explanation.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveExplanation_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = QuestionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveExplanation(ExplanationObjectMother.Create());

            question.ModifiedOn.Should().Be(dateTime);
        }

        #endregion
    }
}

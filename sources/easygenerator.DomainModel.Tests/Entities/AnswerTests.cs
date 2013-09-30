using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class AnswerTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Answer_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => AnswerObjectMother.CreateWithText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void Answer_ShouldThrowArgumentException_WhenTextIsEmpty()
        {
            Action action = () => AnswerObjectMother.CreateWithText(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void Answer_ShouldCreateAnswerInstance()
        {
            const string text = "text";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = AnswerObjectMother.Create(text, true, CreatedBy);

            answer.Id.Should().NotBeEmpty();
            answer.Text.Should().Be(text);
            answer.IsCorrect.Should().BeTrue();
            answer.Question.Should().BeNull();
            answer.CreatedOn.Should().Be(DateTime.MaxValue);
            answer.ModifiedOn.Should().Be(DateTime.MaxValue);
            answer.CreatedBy.Should().Be(CreatedBy);
            answer.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update text

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.UpdateText(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.UpdateText(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateText()
        {
            const string text = "text";
            var answer = AnswerObjectMother.Create();

            answer.UpdateText(text, ModifiedBy);

            answer.Text.Should().Be(text);
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var answer = AnswerObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            answer.UpdateText("text", ModifiedBy);

            answer.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.UpdateText("text", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.UpdateText("text", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateMoidifiedBy()
        {
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            answer.UpdateText("text", user);

            answer.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region Update correctness

        [TestMethod]
        public void UpdateCorrectness_ShouldUpdateIsCorrect()
        {
            var answer = AnswerObjectMother.CreateWithCorrectness(false);

            answer.UpdateCorrectness(true, ModifiedBy);

            answer.IsCorrect.Should().BeTrue();
        }

        [TestMethod]
        public void UpdateCorrectness_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var answer = AnswerObjectMother.CreateWithCorrectness(false);

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            answer.UpdateCorrectness(true, ModifiedBy);

            answer.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateCorrectness_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.UpdateCorrectness(true, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateCorrectness_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.UpdateCorrectness(true, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateCorrectness_ShouldUpdateMoidifiedBy()
        {
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            answer.UpdateCorrectness(true, user);

            answer.ModifiedBy.Should().Be(user);
        }

        #endregion
    }
}

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
    public class AnswerTests
    {
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

            var answer = AnswerObjectMother.Create(text, true);

            answer.Id.Should().NotBeEmpty();
            answer.Text.Should().Be(text);
            answer.IsCorrect.Should().BeTrue();
            answer.Question.Should().BeNull();
            answer.CreatedOn.Should().Be(DateTime.MaxValue);
            answer.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion

        #region Update text

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.UpdateText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.UpdateText(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateText()
        {
            const string text = "text";
            var answer = AnswerObjectMother.Create();

            answer.UpdateText(text);

            answer.Text.Should().Be(text);
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var answer = AnswerObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            answer.UpdateText("text");

            answer.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region Update correctness

        [TestMethod]
        public void UpdateCorrectness_ShouldUpdateIsCorrect()
        {
            var answer = AnswerObjectMother.CreateWithCorrectness(false);

            answer.UpdateCorrectness(true);

            answer.IsCorrect.Should().BeTrue();
        }

        [TestMethod]
        public void UpdateCorrectness_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var answer = AnswerObjectMother.CreateWithCorrectness(false);

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            answer.UpdateCorrectness(true);

            answer.ModifiedOn.Should().Be(dateTime);
        }

        #endregion
    }
}

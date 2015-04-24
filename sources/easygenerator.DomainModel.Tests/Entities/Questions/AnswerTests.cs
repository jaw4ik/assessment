using System;
using easygenerator.DomainModel.Events.AnswerEvents;
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


        [TestMethod]
        public void UpdateText_ShouldAddAnswerTextUpdatedEvent()
        {
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            answer.UpdateText("text", user);

            answer.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(AnswerTextUpdatedEvent));
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

        [TestMethod]
        public void UpdateCorrectness_ShouldAddMultipleselectAnswerCorrectnessUpdatedEvent()
        {
            var answer = AnswerObjectMother.Create();
            var user = "Some user";

            answer.UpdateCorrectness(true, user);

            answer.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(AnswerCorrectnessUpdatedEvent));
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var answer = AnswerObjectMother.Create();

            Action action = () => answer.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var answer = AnswerObjectMother.CreateWithCreatedBy(createdBy);

            answer.DefineCreatedBy(updatedCreatedBy);

            answer.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var answer = AnswerObjectMother.CreateWithCreatedBy(createdBy);

            answer.DefineCreatedBy(updatedCreatedBy);

            answer.ModifiedBy.Should().Be(updatedCreatedBy);
        }


        #endregion
    }
}

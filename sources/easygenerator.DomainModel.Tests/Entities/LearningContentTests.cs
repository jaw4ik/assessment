using System;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class LearningContentTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void LearningContent_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => LearningContentObjectMother.CreateWithText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void LearningContent_ShouldThrowArgumentOutOfRangeException_WhenPositionIsLessThenMinus999()
        {
            Action action = () => LearningContentObjectMother.CreateWithPosition(-1000);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("position");
        }

        [TestMethod]
        public void LearningContent_ShouldThrowArgumentOutOfRangeException_WhenPositionIsMoreThen999()
        {
            Action action = () => LearningContentObjectMother.CreateWithPosition(1000);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("position");
        }

        [TestMethod]
        public void LearningContent_ShouldCreateLearningContentInstance()
        {
            const string text = "text";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = LearningContentObjectMother.Create(text, CreatedBy, 10);

            answer.Id.Should().NotBeEmpty();
            answer.Text.Should().Be(text);
            answer.Question.Should().BeNull();
            answer.CreatedOn.Should().Be(DateTime.MaxValue);
            answer.ModifiedOn.Should().Be(DateTime.MaxValue);
            answer.CreatedBy.Should().Be(CreatedBy);
            answer.ModifiedBy.Should().Be(CreatedBy);
            answer.Position.Should().Be(10);
        }

        #endregion

        #region Update text

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.UpdateText(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateText()
        {
            const string text = "text";
            var learningContent = LearningContentObjectMother.Create();

            learningContent.UpdateText(text, ModifiedBy);

            learningContent.Text.Should().Be(text);
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var learningContent = LearningContentObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            learningContent.UpdateText("text", ModifiedBy);

            learningContent.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.UpdateText("Some text", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.UpdateText("Some text", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModifiedBy()
        {
            var learningContent = LearningContentObjectMother.Create();
            const string user = "Some user";

            learningContent.UpdateText("Some text", user);

            learningContent.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateText_ShouldAddLearningContentDeletedEvent()
        {
            var learningContent = LearningContentObjectMother.Create();

            learningContent.UpdateText("Some text", "username");

            learningContent.ShouldContainSingleEvent<LearningContentUpdatedEvent>();
        }

        #endregion

        #region Update position

        [TestMethod]
        public void UpdatePosition_ShouldUpdatePosition()
        {
            const decimal position = 1;
            var learningContent = LearningContentObjectMother.Create();

            learningContent.UpdatePosition(position, ModifiedBy);

            learningContent.Position.Should().Be(position);
        }

        [TestMethod]
        public void UpdatePosition_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var learningContent = LearningContentObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            learningContent.UpdatePosition(1, ModifiedBy);

            learningContent.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdatePosition_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.UpdatePosition(1, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdatePosition_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.UpdatePosition(1, null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdatePosition_ShouldUpdateModifiedBy()
        {
            var learningContent = LearningContentObjectMother.Create();
            const string user = "Some user";

            learningContent.UpdatePosition(1, user);

            learningContent.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdatePosition_ShouldAddLearningContentUpdatedEvent()
        {
            var learningContent = LearningContentObjectMother.Create();

            learningContent.UpdatePosition(1, "username");

            learningContent.ShouldContainSingleEvent<LearningContentUpdatedEvent>();
        }


        [TestMethod]
        public void UpdatePosition_ShouldThrowArgumentOutOfRangeException_WhenPositionIsLessThenMinus999()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.UpdatePosition(-1000, "modifier");

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("position");
        }

        [TestMethod]
        public void UpdatePosition_ShouldThrowArgumentOutOfRangeException_WhenPositionIsMoreThen999()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.UpdatePosition(1000, "modifier");

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("position");
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var learningContent = LearningContentObjectMother.Create();

            Action action = () => learningContent.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var learningContent = LearningContentObjectMother.CreateWithCreatedBy(createdBy);

            learningContent.DefineCreatedBy(updatedCreatedBy);

            learningContent.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var learningContent = LearningContentObjectMother.CreateWithCreatedBy(createdBy);

            learningContent.DefineCreatedBy(updatedCreatedBy);

            learningContent.ModifiedBy.Should().Be(updatedCreatedBy);
        }

        #endregion
    }
}

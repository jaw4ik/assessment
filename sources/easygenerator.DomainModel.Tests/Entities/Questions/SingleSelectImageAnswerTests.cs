using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using easygenerator.DomainModel.Tests.Utils;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class SingleSelectImageAnswerTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Answer_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => SingleSelectImageAnswerObjectMother.CreateWithImage(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void Answer_ShouldCreateAnswerInstance()
        {
            const string image = "image";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = SingleSelectImageAnswerObjectMother.Create(image, CreatedBy);

            answer.Id.Should().NotBeEmpty();
            answer.Image.Should().Be(image);
            answer.Question.Should().BeNull();
            answer.CreatedOn.Should().Be(DateTime.MaxValue);
            answer.ModifiedOn.Should().Be(DateTime.MaxValue);
            answer.CreatedBy.Should().Be(CreatedBy);
            answer.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update image

        [TestMethod]
        public void UpdateImage_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => answer.UpdateImage(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateText()
        {
            const string text = "text";
            var answer = SingleSelectImageAnswerObjectMother.Create();

            answer.UpdateImage(text, ModifiedBy);

            answer.Image.Should().Be(text);
        }

        [TestMethod]
        public void UpdateImage_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var answer = SingleSelectImageAnswerObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            answer.UpdateImage("text", ModifiedBy);

            answer.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateImage_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => answer.UpdateImage("text", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateImage_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => answer.UpdateImage("text", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateImage_ShouldUpdateMoidifiedBy()
        {
            var answer = SingleSelectImageAnswerObjectMother.Create();
            var user = "Some user";

            answer.UpdateImage("text", user);

            answer.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateImage_ShouldAddSingleSelectImageAnswerImageUpdatedEvent()
        {
            var answer = SingleSelectImageAnswerObjectMother.Create();

            answer.UpdateImage("text", "username");

            answer.ShouldContainSingleEvent<SingleSelectImageAnswerImageUpdatedEvent>();
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void CreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => answer.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void CreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var answer = SingleSelectImageAnswerObjectMother.Create();

            Action action = () => answer.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void CreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var answer = SingleSelectImageAnswerObjectMother.CreateWithCreatedBy(createdBy);

            answer.DefineCreatedBy(updatedCreatedBy);

            answer.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void CreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var answer = SingleSelectImageAnswerObjectMother.CreateWithCreatedBy(createdBy);

            answer.DefineCreatedBy(updatedCreatedBy);

            answer.ModifiedBy.Should().Be(updatedCreatedBy);
        }


        #endregion
    }
}

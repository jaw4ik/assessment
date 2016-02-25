using System;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class TextMatchingAnswerTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void TextMatchingAnswer_ShouldThrowArgumentNullException_WhenKeyIsNull()
        {
            Action action = () => TextMatchingAnswerObjectMother.CreateWithKey(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("key");
        }

        [TestMethod]
        public void TextMatchingAnswer_ShouldThrowArgumentException_WhenKeyIsEmpty()
        {
            Action action = () => TextMatchingAnswerObjectMother.CreateWithKey(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("key");
        }

        [TestMethod]
        public void TextMatchingAnswer_ShouldThrowArgumentOutOfRangeException_WhenKeyIsLongerThan255()
        {
            Action action = () => TextMatchingAnswerObjectMother.CreateWithKey(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("key");
        }

        [TestMethod]
        public void TextMatchingAnswer_ShouldThrowArgumentNullException_WhenValueIsNull()
        {
            Action action = () => TextMatchingAnswerObjectMother.CreateWithValue(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("value");
        }

        [TestMethod]
        public void TextMatchingAnswer_ShouldThrowArgumentException_WhenValueIsEmpty()
        {
            Action action = () => TextMatchingAnswerObjectMother.CreateWithValue(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("value");
        }

        [TestMethod]
        public void TextMatchingAnswer_ShouldThrowArgumentOutOfRangeException_WhenValueIsLongerThan255()
        {
            Action action = () => TextMatchingAnswerObjectMother.CreateWithValue(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("value");
        }

        [TestMethod]
        public void TextMatchingAnswer_ShouldCreateQuestionInstance()
        {
            const string key = "key";
            const string value = "value";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = TextMatchingAnswerObjectMother.Create(key, value, CreatedBy);

            answer.Id.Should().NotBeEmpty();
            answer.Key.Should().Be(key);
            answer.Value.Should().Be(value);
            answer.CreatedOn.Should().Be(DateTime.MaxValue);
            answer.ModifiedOn.Should().Be(DateTime.MaxValue);
            answer.CreatedBy.Should().Be(CreatedBy);
            answer.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region ChangeKey

        [TestMethod]
        public void ChangeKey_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => TextMatchingAnswerObjectMother.Create().ChangeKey(null, "modifiedBy");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("key");
        }

        [TestMethod]
        public void ChangeKey_ShouldThrowArgumentException_WhenTextIsEmpty()
        {
            Action action = () => TextMatchingAnswerObjectMother.Create().ChangeKey(String.Empty, "modifiedBy");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("key");
        }

        [TestMethod]
        public void ChangeKey_ShouldThrowArgumentException_WhenKeyIsLongerThan255()
        {
            Action action = () => TextMatchingAnswerObjectMother.CreateWithKey(new string('*', 256));

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("key");
        }

        [TestMethod]
        public void ChangeKey_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var answer = TextMatchingAnswerObjectMother.Create();

            Action action = () => answer.ChangeKey("key", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeKey_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var answer = TextMatchingAnswerObjectMother.Create();

            Action action = () => answer.ChangeKey("key", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeKey_ShouldChangeKey()
        {
            //Arrange
            const string key = "changed key";
            var answer = TextMatchingAnswerObjectMother.CreateWithKey("key");

            //Act
            answer.ChangeKey(key, "user");

            //Assert
            answer.Key.Should().Be(key);
        }

        [TestMethod]
        public void ChangeKey_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var answer = TextMatchingAnswerObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            answer.ChangeKey("key", ModifiedBy);

            answer.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangeKey_ShouldUpdateModifiedBy()
        {
            var answer = TextMatchingAnswerObjectMother.Create();
            const string user = "user";

            answer.ChangeKey("key", user);

            answer.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangeKey_ShouldAddDropspotTextChangedEvent()
        {
            var answer = TextMatchingAnswerObjectMother.Create();

            answer.ChangeKey("key", "username");

            answer.ShouldContainSingleEvent<TextMatchingAnswerKeyChangedEvent>();
        }

        #endregion

        #region ChangeValue

        [TestMethod]
        public void ChangeValue_ShouldThrowArgumentNullException_WhenValueIsNull()
        {
            Action action = () => TextMatchingAnswerObjectMother.Create().ChangeValue(null, "modifiedBy");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("value");
        }

        [TestMethod]
        public void ChangeValue_ShouldThrowArgumentException_WhenValueIsEmpty()
        {
            Action action = () => TextMatchingAnswerObjectMother.Create().ChangeValue(String.Empty, "modifiedBy");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("value");
        }

        [TestMethod]
        public void ChangeValue_ShouldThrowArgumentException_WhenValueIsLongerThan255()
        {
            Action action = () => TextMatchingAnswerObjectMother.CreateWithValue(new string('*', 256));

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("value");
        }

        [TestMethod]
        public void ChangeValue_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var answer = TextMatchingAnswerObjectMother.Create();

            Action action = () => answer.ChangeValue("value", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeValue_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var answer = TextMatchingAnswerObjectMother.Create();

            Action action = () => answer.ChangeValue("value", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeValue_ShouldChangeValue()
        {
            //Arrange
            const string value = "changed value";
            var answer = TextMatchingAnswerObjectMother.CreateWithValue("value");

            //Act
            answer.ChangeValue(value, "user");

            //Assert
            answer.Value.Should().Be(value);
        }

        [TestMethod]
        public void ChangeValue_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var answer = TextMatchingAnswerObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            answer.ChangeValue("value", ModifiedBy);

            answer.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangeValue_ShouldUpdateModifiedBy()
        {
            var answer = TextMatchingAnswerObjectMother.Create();
            const string user = "user";

            answer.ChangeValue("value", user);

            answer.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangeValue_ShouldAddDropspotTextChangedEvent()
        {
            var answer = TextMatchingAnswerObjectMother.Create();

            answer.ChangeValue("value", "username");

            answer.ShouldContainSingleEvent<TextMatchingAnswerValueChangedEvent>();
        }

        #endregion

    }
}

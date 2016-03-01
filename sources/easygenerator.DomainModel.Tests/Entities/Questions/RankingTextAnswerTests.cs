using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class RankingTextAnswerTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void RankingTextAnswer_ShouldThrowArgumentNullException_WhenKeyIsNull()
        {
            Action action = () => RankingTextAnswerObjectMother.CreateWithText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void RankingTextAnswer_ShouldCreateInstance()
        {
            const string text = "text";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = RankingTextAnswerObjectMother.Create(text, CreatedBy);

            answer.Id.Should().NotBeEmpty();
            answer.Text.Should().Be(text);
            answer.CreatedOn.Should().Be(DateTime.MaxValue);
            answer.ModifiedOn.Should().Be(DateTime.MaxValue);
            answer.CreatedBy.Should().Be(CreatedBy);
            answer.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region UpdateText

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => RankingTextAnswerObjectMother.Create().UpdateText(null, "modifiedBy");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var answer = RankingTextAnswerObjectMother.Create();

            Action action = () => answer.UpdateText("text", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var answer = RankingTextAnswerObjectMother.Create();

            Action action = () => answer.UpdateText("text", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldChangeText()
        {
            //Arrange
            const string text = "changed text";
            var answer = RankingTextAnswerObjectMother.CreateWithText("text");

            //Act
            answer.UpdateText(text, "user");

            //Assert
            answer.Text.Should().Be(text);
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var answer = RankingTextAnswerObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            answer.UpdateText("text", ModifiedBy);

            answer.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModifiedBy()
        {
            var answer = RankingTextAnswerObjectMother.Create();
            const string user = "user";

            answer.UpdateText("text", user);

            answer.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateText_ShouldReiseRankingTextAnswerTextChangedEvent()
        {
            var answer = RankingTextAnswerObjectMother.Create();

            answer.UpdateText("text", "username");

            answer.ShouldContainSingleEvent<RankingTextAnswerTextChangedEvent>();
        }

        #endregion
    }
}

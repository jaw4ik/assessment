using System;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class SurveyQuestionTest
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        [TestMethod]
        public void Question_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => SurveyQuestionObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => SurveyQuestionObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => SurveyQuestionObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Question_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = SurveyQuestionObjectMother.Create(title, CreatedBy, false);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.IsSurvey.Should().BeFalse();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        #region UpdateIsSurvey

        [TestMethod]
        public void UpdateIsSurvey_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = SurveyQuestionObjectMother.Create();

            Action action = () => question.UpdateIsSurvey(false, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateIsSurvey_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = SurveyQuestionObjectMother.Create();

            Action action = () => question.UpdateIsSurvey(false, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateIsSurvey_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = SurveyQuestionObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.UpdateIsSurvey(false, ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateIsSurvey_ShouldUpdateIsSurvey()
        {
            var question = SurveyQuestionObjectMother.Create();
            var user = "Some user";

            question.UpdateIsSurvey(false, user);

            question.IsSurvey.Should().BeFalse();
        }

        [TestMethod]
        public void UpdateIsSurvey_ShouldUpdateModifiedBy()
        {
            var question = SurveyQuestionObjectMother.Create();
            var user = "Some user";

            question.UpdateIsSurvey(false, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void UpdateIsSurve_ShouldAddQuestionIsSurveyUpdatedEvent()
        {
            var question = SurveyQuestionObjectMother.Create();

            question.UpdateIsSurvey(false, "user");

            question.ShouldContainSingleEvent<QuestionIsSurveyUpdatedEvent>();
        }


        #endregion UpdateIsSurvey
    }
}

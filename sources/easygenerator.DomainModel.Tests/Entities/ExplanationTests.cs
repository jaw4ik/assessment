using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ExplanationTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Explanation_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => ExplanationObjectMother.CreateWithText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void Explanation_ShouldThrowArgumentException_WhenTextIsEmpty()
        {
            Action action = () => ExplanationObjectMother.CreateWithText(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }


        [TestMethod]
        public void Explanation_ShouldCreateAnswerInstance()
        {
            const string text = "text";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = ExplanationObjectMother.Create(text, CreatedBy);

            answer.Id.Should().NotBeEmpty();
            answer.Text.Should().Be(text);
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
            var explanation = ExplanationObjectMother.Create();

            Action action = () => explanation.UpdateText(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var explanation = ExplanationObjectMother.Create();

            Action action = () => explanation.UpdateText(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateText()
        {
            const string text = "text";
            var explanation = ExplanationObjectMother.Create();

            explanation.UpdateText(text, ModifiedBy);

            explanation.Text.Should().Be(text);
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var explanation = ExplanationObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            explanation.UpdateText("text", ModifiedBy);

            explanation.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var explanation = ExplanationObjectMother.Create();

            Action action = () => explanation.UpdateText("Some text", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var explanation = ExplanationObjectMother.Create();

            Action action = () => explanation.UpdateText("Some text", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateMoidifiedBy()
        {
            var explanation = ExplanationObjectMother.Create();
            var user = "Some user";

            explanation.UpdateText("Some text", user);

            explanation.ModifiedBy.Should().Be(user);
        }

        #endregion
    }
}

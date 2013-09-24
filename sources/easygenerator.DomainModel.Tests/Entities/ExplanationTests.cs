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
    public class ExplanationTests
    {
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

            var answer = ExplanationObjectMother.Create(text);

            answer.Id.Should().NotBeEmpty();
            answer.Text.Should().Be(text);
            answer.Question.Should().BeNull();
            answer.CreatedOn.Should().Be(DateTime.MaxValue);
            answer.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion

        #region Update text

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            var explanation = ExplanationObjectMother.Create();

            Action action = () => explanation.UpdateText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var explanation = ExplanationObjectMother.Create();

            Action action = () => explanation.UpdateText(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateText()
        {
            const string text = "text";
            var explanation = ExplanationObjectMother.Create();

            explanation.UpdateText(text);

            explanation.Text.Should().Be(text);
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var explanation = ExplanationObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            explanation.UpdateText("text");

            explanation.ModifiedOn.Should().Be(dateTime);
        }

        #endregion
    }
}

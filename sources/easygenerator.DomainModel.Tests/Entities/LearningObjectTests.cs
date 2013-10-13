using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class LearningObjectTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void LearningObject_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => LearningObjectObjectMother.CreateWithText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void LearningObject_ShouldThrowArgumentException_WhenTextIsEmpty()
        {
            Action action = () => LearningObjectObjectMother.CreateWithText(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }


        [TestMethod]
        public void LearningObject_ShouldCreateLearningObjectInstance()
        {
            const string text = "text";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var answer = LearningObjectObjectMother.Create(text, CreatedBy);

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
            var learningObject = LearningObjectObjectMother.Create();

            Action action = () => learningObject.UpdateText(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var learningObject = LearningObjectObjectMother.Create();

            Action action = () => learningObject.UpdateText(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateText()
        {
            const string text = "text";
            var learningObject = LearningObjectObjectMother.Create();

            learningObject.UpdateText(text, ModifiedBy);

            learningObject.Text.Should().Be(text);
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var learningObject = LearningObjectObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            learningObject.UpdateText("text", ModifiedBy);

            learningObject.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var learningObject = LearningObjectObjectMother.Create();

            Action action = () => learningObject.UpdateText("Some text", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var learningObject = LearningObjectObjectMother.Create();

            Action action = () => learningObject.UpdateText("Some text", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateText_ShouldUpdateMoidifiedBy()
        {
            var learningObject = LearningObjectObjectMother.Create();
            const string user = "Some user";

            learningObject.UpdateText("Some text", user);

            learningObject.ModifiedBy.Should().Be(user);
        }

        #endregion

        #region Define createdBy

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            var learningObject = LearningObjectObjectMother.Create();

            Action action = () => learningObject.DefineCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            var learningObject = LearningObjectObjectMother.Create();

            Action action = () => learningObject.DefineCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateCreatedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var learningObject = LearningObjectObjectMother.CreateWithCreatedBy(createdBy);

            learningObject.DefineCreatedBy(updatedCreatedBy);

            learningObject.CreatedBy.Should().Be(updatedCreatedBy);
        }

        [TestMethod]
        public void DefineCreatedBy_ShouldUpdateModifiedBy()
        {
            const string createdBy = "createdBy";
            const string updatedCreatedBy = "updatedCreatedBy";
            var learningObject = LearningObjectObjectMother.CreateWithCreatedBy(createdBy);

            learningObject.DefineCreatedBy(updatedCreatedBy);

            learningObject.ModifiedBy.Should().Be(updatedCreatedBy);
        }

        #endregion
    }
}

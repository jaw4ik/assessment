using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class LearningPathTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        private readonly DateTime _currentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => _currentDate;
        }

        #region Constructor

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => LearningPathObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void LearningPath_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            Action action = () => LearningPathObjectMother.CreateWithCreatedBy(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("createdBy");
        }


        [TestMethod]
        public void LearningPath_ShouldThrowArgumentException_WhenCreatedByIsEmpty()
        {
            Action action = () => LearningPathObjectMother.CreateWithCreatedBy(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("createdBy");
        }

        [TestMethod]
        public void LearningPath_ShouldCreateLearningPathInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var learningPath = LearningPathObjectMother.Create(title, CreatedBy);

            learningPath.Id.Should().NotBeEmpty();
            learningPath.Title.Should().Be(title);
            learningPath.CreatedOn.Should().Be(DateTime.MaxValue);
            learningPath.ModifiedOn.Should().Be(DateTime.MaxValue);
            learningPath.CreatedBy.Should().Be(CreatedBy);
            learningPath.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Update title

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle(new string('*', 256), ModifiedBy);

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateTitle()
        {
            const string title = "title";
            var learningPath = LearningPathObjectMother.Create();

            learningPath.UpdateTitle(title, ModifiedBy);

            learningPath.Title.Should().Be(title);
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var learningPath = LearningPathObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            learningPath.UpdateTitle("title", ModifiedBy);

            learningPath.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle("Some title", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var learningPath = LearningPathObjectMother.Create();

            Action action = () => learningPath.UpdateTitle("Some title", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateTitle_ShouldUpdateMoidifiedBy()
        {
            var learningPath = LearningPathObjectMother.Create();
            var user = "Some user";

            learningPath.UpdateTitle("Some title", user);

            learningPath.ModifiedBy.Should().Be(user);
        }

        #endregion
    }
}

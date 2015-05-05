using easygenerator.PublicationServer.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.PublicationServer.Tests.Publish
{
    [TestClass]
    public class PublishDispatcherTest
    {
        private PublishDispatcher _publishDispatcher;
        private const string _courseId = "courseId";

        [TestInitialize]
        public void InitializeDispatcher()
        {
            _publishDispatcher = new PublishDispatcher();
        }

        #region Validation

        [TestMethod]
        public void StartPublish_ShouldThrowArgumentNullException_WhenCourseIdIsNull()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.StartPublish(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("courseId");
        }

        [TestMethod]
        public void StartPublish_ShouldThrowArgumentException_WhenCourseIdIsEmpty()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.StartPublish(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("courseId");
        }

        [TestMethod]
        public void EndPublish_ShouldThrowArgumentNullException_WhenCourseIdIsNull()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.EndPublish(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("courseId");
        }

        [TestMethod]
        public void EndPublish_ShouldThrowArgumentException_WhenCourseIdIsEmpty()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.EndPublish(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("courseId");
        }

        [TestMethod]
        public void IsPublishing_ShouldThrowArgumentNullException_WhenCourseIdIsNull()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.IsPublishing(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("courseId");
        }

        [TestMethod]
        public void IsPublishing_ShouldThrowArgumentException_WhenCourseIdIsEmpty()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.IsPublishing(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("courseId");
        }

        #endregion

        [TestMethod]
        public void IsPublishing_ShouldReturnFalseIfCourseIdWasNotAdded()
        {
            // Arrange

            // Act
            var result = _publishDispatcher.IsPublishing(_courseId);

            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void IsPublishing_ShouldReturnTrueIfCourseIdWasAdded()
        {
            // Arrange
            _publishDispatcher.StartPublish(_courseId);

            // Act
            var result = _publishDispatcher.IsPublishing(_courseId);

            // Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void IsPublishing_ShouldReturnFalseIfCourseIdWasAddedAndRemoved()
        {
            // Arrange
            _publishDispatcher.StartPublish(_courseId);
            _publishDispatcher.EndPublish(_courseId);

            // Act
            var result = _publishDispatcher.IsPublishing(_courseId);

            // Assert
            result.Should().Be(false);
        }
    }
}

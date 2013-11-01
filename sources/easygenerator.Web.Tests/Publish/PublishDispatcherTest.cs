using easygenerator.Web.Publish;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;

namespace easygenerator.Web.Tests.Publish
{
    [TestClass]
    public class PublishDispatcherTest
    {
        private PublishDispatcher _publishDispatcher;
        private const string _experienceId = "experienceId";

        [TestInitialize]
        public void InitializeDispatcher()
        {
            _publishDispatcher = new PublishDispatcher();
        }

        #region Validation

        [TestMethod]
        public void StartPublish_ShouldThrowArgumentNullException_WhenExperienceIdIsNull()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.StartPublish(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("experienceId");
        }

        [TestMethod]
        public void StartPublish_ShouldThrowArgumentException_WhenExperienceIdIsEmpty()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.StartPublish(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("experienceId");
        }

        [TestMethod]
        public void EndPublish_ShouldThrowArgumentNullException_WhenExperienceIdIsNull()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.EndPublish(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("experienceId");
        }

        [TestMethod]
        public void EndPublish_ShouldThrowArgumentException_WhenExperienceIdIsEmpty()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.EndPublish(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("experienceId");
        }

        [TestMethod]
        public void IsPublishing_ShouldThrowArgumentNullException_WhenExperienceIdIsNull()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.IsPublishing(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("experienceId");
        }

        [TestMethod]
        public void IsPublishing_ShouldThrowArgumentException_WhenExperienceIdIsEmpty()
        {
            //Arrange
            //Act
            Action action = () => _publishDispatcher.IsPublishing(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("experienceId");
        }

        #endregion

        [TestMethod]
        public void IsPublishing_ShouldReturnFalseIfExperienceIdWasNotAdded()
        {
            // Arrange

            // Act
            var result = _publishDispatcher.IsPublishing(_experienceId);

            // Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void IsPublishing_ShouldReturnTrueIfExperienceIdWasAdded()
        {
            // Arrange
            _publishDispatcher.StartPublish(_experienceId);

            // Act
            var result = _publishDispatcher.IsPublishing(_experienceId);

            // Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void IsPublishing_ShouldReturnFalseIfExperienceIdWasAddedAndRemoved()
        {
            // Arrange
            _publishDispatcher.StartPublish(_experienceId);
            _publishDispatcher.EndPublish(_experienceId);

            // Act
            var result = _publishDispatcher.IsPublishing(_experienceId);

            // Assert
            result.Should().Be(false);
        }
    }
}

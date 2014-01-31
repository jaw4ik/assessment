using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Publish
{
    [TestClass]
    public class CoursePublisherTest
    {
        private CoursePublisher _publisher;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _pathProvider;
        private IPublishDispatcher _publishDispatcher;
        private const string DestinationDirectoryPath = "d:\\somePath";

        [TestInitialize]
        public void InitializePublisher()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _pathProvider = new BuildPathProvider(_httpRuntimeWrapper);
            _publishDispatcher = Substitute.For<IPublishDispatcher>();
            _publisher = new CoursePublisher(_fileManager, _pathProvider, _publishDispatcher);
        }

        #region Publish

        [TestMethod]
        public void Publish_ShouldThrowArgumentException_WhenDestinationDirectoryPathIsEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create("CourseTitle");

            //Act
            Action action = () => _publisher.Publish(course, "");

            //Assert
            action.ShouldThrow<ArgumentException>();
        }

        [TestMethod]
        public void Publish_ShouldThrowArgumentException_WhenDestinationDirectoryPathIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create("CourseTitle");

            //Act
            Action action = () => _publisher.Publish(course, null);

            //Assert
            action.ShouldThrow<ArgumentException>();
        }

        [TestMethod]
        public void Publish_ShouldThrowArgumentNotSupportedException_WhenCourseBuildOnIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create("CourseTitle");

            //Act
            Action action = () => _publisher.Publish(course, DestinationDirectoryPath);

            //Assert
            action.ShouldThrow<NotSupportedException>();
        }

        [TestMethod]
        public void Publish_ShouldCallPublishDispatcherStartMethod()
        {
            //Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");
            //Act
            _publisher.Publish(course, DestinationDirectoryPath);

            //Assert
            _publishDispatcher.Received().StartPublish(course.Id.ToString());
        }

        [TestMethod]
        public void Publish_ShouldCallPublishDispatcherEndMethod()
        {
            //Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");
            //Act
            _publisher.Publish(course, DestinationDirectoryPath);

            //Assert
            _publishDispatcher.Received().EndPublish(course.Id.ToString());
        }

        #endregion
     
    }
}

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
        private IUrlHelperWrapper _urlHelper;

        [TestInitialize]
        public void InitializePublisher()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _pathProvider = new BuildPathProvider(_httpRuntimeWrapper);
            _publishDispatcher = Substitute.For<IPublishDispatcher>();
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _publisher = new CoursePublisher(_fileManager, _pathProvider, _publishDispatcher, _urlHelper);
        }

        [TestMethod]
        public void Publish_ShouldThrowArgumentNotSupportedExceptionIfCourseBuildOnIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create("CourseTitle");

            //Act
            Action action = () => _publisher.Publish(course);

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
            _publisher.Publish(course);

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
            _publisher.Publish(course);

            //Assert
            _publishDispatcher.Received().EndPublish(course.Id.ToString());
        }

        [TestMethod]
        public void Publish_ShouldUpdateExperiecePublishedOnDate()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");

            //Act
            _publisher.Publish(course);

            //Assert
            course.PublishedOn.Should().Be(DateTime.MaxValue);
        }
    }
}

using System;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;
using easygenerator.Web.Publish;

namespace easygenerator.Web.Tests.Publish
{
    [TestClass]
    public class CoursePublishingServiceTests
    {
        private ICoursePublisher _publisher;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private BuildPathProvider _pathProvider;
        private IUrlHelperWrapper _urlHelper;

        private ICoursePublishingService _coursePublishingService;

        [TestInitialize]
        public void Initialize()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _pathProvider = Substitute.For<BuildPathProvider>(_httpRuntimeWrapper);
            _publisher = Substitute.For<ICoursePublisher>();
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _coursePublishingService = new CoursePublishingService(_pathProvider, _publisher, _urlHelper);
        }

        #region GetPublishedResourcePhysicalPath

        [TestMethod]
        public void GetPublishedResourcePhysicalPath_ShouldCallPathProviderGetPublishedResourcePath()
        {
            //Arrange
            const string resourcePath = "path/some/resource";

            //Act
            _coursePublishingService.GetPublishedResourcePhysicalPath(resourcePath);

            //Assert
            _pathProvider.Received().GetPublishedResourcePath(resourcePath.Replace("/", "\\"));
        }

        #endregion

        #region GetPublishedPackageUrl

        [TestMethod]
        public void GetPublishedPackageUrl_ShouldCallUrlHelperToAbsoluteUrl()
        {
            //Arrange
            const string courseId = "id";

            //Act
            _coursePublishingService.GetPublishedPackageUrl(courseId);

            //Assert
            _urlHelper.Received().ToAbsoluteUrl(String.Format("~/storage/{0}/", courseId));
        }

        #endregion

        #region GetCourseReviewUrl

        [TestMethod]
        public void GetCourseReviewUrl_ShouldCallUrlHelperToAbsoluteUrl()
        {
            //Arrange
            const string courseId = "id";

            //Act
            _coursePublishingService.GetCourseReviewUrl(courseId);

            //Assert
            _urlHelper.Received().ToAbsoluteUrl(String.Format("~/review/{0}/", courseId));
        }

        #endregion

        #region Publish

        [TestMethod]
        public void Publish_ShouldCallPathProviderGetPublishFolderPath()
        {
            //Arrange
            var course = CourseObjectMother.Create("CourseTitle");

            //Act
            _coursePublishingService.Publish(course);

            //Assert
            _pathProvider.Received().GetPublishFolderPath(course.Id.ToString());
        }

        [TestMethod]
        public void Publish_ShouldCallCoursePublisherPublish()
        {
            //Arrange
            const string path = "somePath";
            var course = CourseObjectMother.Create("CourseTitle");
            _pathProvider.GetPublishFolderPath(Arg.Any<string>()).Returns(path);

            //Act
            _coursePublishingService.Publish(course);

            //Assert
            _publisher.Received().Publish(course, path);
        }

        [TestMethod]
        public void Publish_ShouldUpdateExperiecePublishedOnDate_WhenPublishIsSuccessful()
        {
            //Arrange
            var course = Substitute.For<Course>();
            _publisher.Publish(course, Arg.Any<string>()).Returns(true);

            //Act
            _coursePublishingService.Publish(course);

            //Assert
            course.Received().UpdatePublishedOnDate();
        }

        [TestMethod]
        public void Publish_ShouldNotUpdateExperiecePublishedOnDate_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = Substitute.For<Course>();
            _publisher.Publish(course, Arg.Any<string>()).Returns(false);

            //Act
            _coursePublishingService.Publish(course);

            //Assert
            course.DidNotReceive().UpdatePublishedOnDate();
        }

        [TestMethod]
        public void Publish_ShouldReturnTrue_WhenPublishIsSuccessful()
        {
            //Arrange
            var course = Substitute.For<Course>();
            _publisher.Publish(course, Arg.Any<string>()).Returns(true);

            //Act
            var result = _coursePublishingService.Publish(course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenPublishIsNotSuccessful()
        {
            //Arrange
            var course = Substitute.For<Course>();
            _publisher.Publish(course, Arg.Any<string>()).Returns(false);

            //Act
            var result = _coursePublishingService.Publish(course);

            //Assert
            result.Should().BeFalse();
        }

        #endregion

    }
}

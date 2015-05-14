using System;
using System.Net;
using System.Web.Http;
using easygenerator.PublicationServer.Controllers;
using easygenerator.PublicationServer.MultipartFormData;
using easygenerator.PublicationServer.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Net.Http;

namespace easygenerator.PublicationServer.Tests.Controllers
{
    [TestClass]
    public class PublishControllerTests
    {
        private PublishController _publishController;
        private ICoursePublisher _coursePublisher;
        private CourseMultipartFormDataManager _formDataManager;
        private IPublishDispatcher _publishDispatcher;
        private PublicationPathProvider _publicationPathProvider;


        [TestInitialize]
        public void Initialize()
        {
            _coursePublisher = Substitute.For<ICoursePublisher>();
            _publicationPathProvider = Substitute.For<PublicationPathProvider>();
            _formDataManager = Substitute.For<CourseMultipartFormDataManager>(_publicationPathProvider);
            _publishDispatcher = Substitute.For<IPublishDispatcher>();
            _publishController = new PublishController(_coursePublisher, _formDataManager, _publishDispatcher);

            _publishController.Request = new HttpRequestMessage();
            _publishController.Request.SetConfiguration(new HttpConfiguration());
            _publishController.Request.RequestUri = new Uri("http://applicationUrl");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfCourseIdIsNull()
        {
            // Arrange
            // Act
            var result = _publishController.PublishCourse(null).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Course id cannot be empty.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnServiceUnavailableIfCourseIsAlreadyPublishing()
        {
            // Arrange
            _publishDispatcher.IsPublishing("courseId").Returns(true);

            // Act
            var result = _publishController.PublishCourse("courseId").Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.ServiceUnavailable);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Course 'courseId' is already publishing.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldSaveFileFromRequest()
        {
            // Arrange
            // Act
            var result = _publishController.PublishCourse("courseId").Result;

            // Assert
            _formDataManager.Received().SaveCourseDataAsync(_publishController.Request, "courseId");
        }

        [TestMethod]
        public void PublishCourse_ShouldCallPublishOfCoursePublisher()
        {
            // Arrange
            // Act
            var result = _publishController.PublishCourse("courseId").Result;

            // Assert
            _coursePublisher.Received().PublishCourse("courseId");
        }

        [TestMethod]
        public void PublishCourse_IfPublishWasSuccessfulShouldReturnOkResponse()
        {
            // Arrange
            _coursePublisher.PublishCourse("courseId").Returns(true);

            // Act
            var result = _publishController.PublishCourse("courseId").Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            result.Content.ReadAsStringAsync().Result.Should().Be(string.Format("\"{0}/{1}\"", _publishController.PublicationServerUri, "courseId"));
        }

        [TestMethod]
        public void PublishCourse_IfPublishWasFailedShouldReturnInternalServerErrorResponse()
        {
            // Arrange
            _coursePublisher.PublishCourse("courseId").Returns(false);

            // Act
            var result = _publishController.PublishCourse("courseId").Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Publication failed for course 'courseId'. Please try again.\"");
        }
    }
}

using System;
using System.Collections.Specialized;
using System.Net;
using System.Web.Http;
using easygenerator.PublicationServer.Controllers;
using easygenerator.PublicationServer.MultipartFormData;
using easygenerator.PublicationServer.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Net.Http;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Models;
using easygenerator.PublicationServer.Utils;

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
        private IPublicationRepository _publicationRepository;
        private string ownerEmail = "ownerEmail";
        private string publicationTitle = "title";
        private HttpUtilityWrapper _httpUtilityWrapper;
        private DateTime _createdDate = DateTimeWrapper.Now();
        private CourseMultipartFormDataStreamProvider _formProvider;

        [TestInitialize]
        public void Initialize()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
            _coursePublisher = Substitute.For<ICoursePublisher>();
            _publicationPathProvider = Substitute.For<PublicationPathProvider>();
            _formDataManager = Substitute.For<CourseMultipartFormDataManager>(_publicationPathProvider);
            _publishDispatcher = Substitute.For<IPublishDispatcher>();
            _publicationRepository = Substitute.For<IPublicationRepository>();
            _httpUtilityWrapper = Substitute.For<HttpUtilityWrapper>();
            _formProvider = Substitute.For<CourseMultipartFormDataStreamProvider>("path", Guid.NewGuid());
            _publishController = new PublishController(_coursePublisher, _formDataManager, _publishDispatcher, _publicationRepository, _publicationPathProvider);
            _publicationPathProvider.GetPublicationPublicPath(publicationTitle).Returns(publicationTitle + "-public");

            _publishController.Request = new HttpRequestMessage();
            _publishController.Request.SetConfiguration(new HttpConfiguration());
            _publishController.Request.RequestUri = new Uri("http://applicationUrl");

            _formDataManager.SaveCourseDataAsync(_publishController.Request, Arg.Any<Guid>()).Returns(_formProvider);
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfCourseIdIsEmpty()
        {
            // Arrange
            // Act

            var result = _publishController.PublishCourse(Guid.Empty).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Course id cannot be empty.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnServiceUnavailableIfCourseIsAlreadyPublishing()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            _publishDispatcher.IsPublishing(courseId).Returns(true);

            // Act
            var result = _publishController.PublishCourse(courseId).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.ServiceUnavailable);
            result.Content.ReadAsStringAsync().Result.Should().Be($"\"Course '{courseId}' is already publishing.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldSaveFileFromRequest()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            // Act
            var result = _publishController.PublishCourse(courseId).Result;

            // Assert
            _formDataManager.Received().SaveCourseDataAsync(_publishController.Request, courseId);
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfOwnerEmailIsNull()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", null } };
            _formProvider.FormData.Returns(formParams);

            // Act
            var result = _publishController.PublishCourse(Guid.NewGuid()).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Owner email cannot be null or whitespace.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfOwnerEmailIsEmpty()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", "" } };
            _formProvider.FormData.Returns(formParams);

            // Act
            var result = _publishController.PublishCourse(Guid.NewGuid()).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Owner email cannot be null or whitespace.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfOwnerEmailIsWhiteSpace()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", "   " } };
            _formProvider.FormData.Returns(formParams);

            // Act
            var result = _publishController.PublishCourse(Guid.NewGuid()).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Owner email cannot be null or whitespace.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfTitleIsNull()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", null } };
            _formProvider.FormData.Returns(formParams);

            // Act
            var result = _publishController.PublishCourse(Guid.NewGuid()).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Title cannot be null or whitespace.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfTitleIsEmpty()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", "" } };
            _formProvider.FormData.Returns(formParams);

            // Act
            var result = _publishController.PublishCourse(Guid.NewGuid()).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Title cannot be null or whitespace.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfTitleIsWhiteSpace()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", "   " } };
            _formProvider.FormData.Returns(formParams);

            // Act
            var result = _publishController.PublishCourse(Guid.NewGuid()).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Title cannot be null or whitespace.\"");
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnBadRequestIfCreatedDateIsInvalidDate()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", publicationTitle }, { "createdDate", "date str" } };
            _formProvider.FormData.Returns(formParams);

            // Act
            var result = _publishController.PublishCourse(Guid.NewGuid()).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            result.Content.ReadAsStringAsync().Result.Should().Be("\"Created date cannot be parsed.\"");
        }


        [TestMethod]
        public void PublishCourse_ShouldCallPublishOfCoursePublisher()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", publicationTitle }, { "createdDate", _createdDate.ToString() } };
            _formProvider.FormData.Returns(formParams);

            var courseId = Guid.NewGuid();
            // Act
            var result = _publishController.PublishCourse(courseId).Result;

            // Assert
            _coursePublisher.Received().PublishCourse(courseId);
        }

        [TestMethod]
        public void PublishCourse_IfPublishWasSuccessfulShouldReturnOkResponse()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", publicationTitle }, { "createdDate", _createdDate.ToString() } };
            _formProvider.FormData.Returns(formParams);

            var courseId = Guid.NewGuid();
            _coursePublisher.PublishCourse(courseId).Returns(true);

            // Act
            var result = _publishController.PublishCourse(courseId).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            result.Content.ReadAsStringAsync().Result.Should().Be(
                $"\"{_publishController.PublicationServerUri}/{courseId}\"");
        }

        [TestMethod]
        public void PublishCourse_IfPublishWasSuccessfulShould_AddInfoAboutPublicationIfNotExists()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", publicationTitle }, { "createdDate", _createdDate.ToString() } };
            _formProvider.FormData.Returns(formParams);

            var courseId = Guid.NewGuid();
            _coursePublisher.PublishCourse(courseId).Returns(true);
            _publicationRepository.Get(courseId).Returns((Publication)null);
            _httpUtilityWrapper.UrlEncode(publicationTitle).Returns(publicationTitle + "-encoded");

            // Act
            var result = _publishController.PublishCourse(courseId).Result;

            // Assert
            _publicationRepository.Received().Add(
                Arg.Is<Publication>(_ =>
                    _.Id == courseId &&
                    _.OwnerEmail == ownerEmail &&
                    _.CreatedOn == DateTimeWrapper.Now() &&
                    _.ModifiedOn == DateTimeWrapper.Now() &&
                    _.PublicPath == publicationTitle + "-public"
                )
            );
        }

        [TestMethod]
        public void PublishCourse_IfPublishWasSuccessfulShould_UpdatePublicationIfExists()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", publicationTitle }, { "createdDate", _createdDate.ToString() } };
            _formProvider.FormData.Returns(formParams);

            var courseId = Guid.NewGuid();
            _coursePublisher.PublishCourse(courseId).Returns(true);
            var creationTime = DateTimeWrapper.Now();
            var publication = new Publication(courseId, ownerEmail, publicationTitle);
            _publicationRepository.Get(courseId).Returns(publication);
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var modifiedTime = DateTimeWrapper.Now();
            _httpUtilityWrapper.UrlEncode(publicationTitle).Returns(publicationTitle + "-encoded");

            // Act
            var result = _publishController.PublishCourse(courseId).Result;

            // Assert
            _publicationRepository.Received().Update(
                Arg.Is<Publication>(_ =>
                    publication.CreatedOn == creationTime &&
                    publication.Id == courseId &&
                    publication.ModifiedOn == modifiedTime &&
                    publication.OwnerEmail == ownerEmail &&
                    publication.PublicPath == publicationTitle
                )
            );
        }


        [TestMethod]
        public void PublishCourse_IfPublishWasFailedShouldReturnInternalServerErrorResponse()
        {
            // Arrange
            var formParams = new NameValueCollection { { "ownerEmail", ownerEmail }, { "title", publicationTitle }, { "createdDate", _createdDate.ToString() } };
            _formProvider.FormData.Returns(formParams);

            var courseId = Guid.NewGuid();
            _coursePublisher.PublishCourse(courseId).Returns(false);

            // Act
            var result = _publishController.PublishCourse(courseId).Result;

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
            result.Content.ReadAsStringAsync().Result.Should().Be($"\"Publication failed for course '{courseId}'. Please try again.\"");
        }
    }
}

using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;

namespace easygenerator.Web.Tests.Publish
{
    [TestClass]
    public class CoursePublisherTest
    {
        private CoursePublisher _publisher;
        private PublishUrlResolver _urlResolver;
        private HttpContextWrapper _httpContext;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _pathProvider;
        private HttpClient _httpClient;
        private ConfigurationReader _configurationReader;
        private ILog _logger;

        [TestInitialize]
        public void InitializePublisher()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _pathProvider = Substitute.For<BuildPathProvider>(_httpRuntimeWrapper);
            _httpClient = Substitute.For<HttpClient>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.PublicationConfiguration.Returns(new PublicationConfigurationSection() { ApiKey = "apiKey", ServiceUrl = "serviceUrl" });
            _logger = Substitute.For<ILog>();
            _httpContext = Substitute.For<HttpContextWrapper>();
            _urlResolver = new PublishUrlResolver(_httpContext);
            _publisher = new CoursePublisher(_urlResolver, _fileManager, _pathProvider, _logger, _httpClient, _configurationReader);
        }

        #region Publish

        [TestMethod]
        public void Publish_IfCourseWasNotBuildYetShouldReturnFalse()
        {
            //Arrange
            var course = CourseObjectMother.Create("CourseTitle");

            //Act
            var result = _publisher.Publish(course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void Publish_IfCourseWasNotBuildYetShouldLogException()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");

            // Act
            _publisher.Publish(course);

            // Assert
            _logger.Received().LogException(Arg.Is<NotSupportedException>(ex => ex.Message == string.Format("Publishing of non builded course is not supported. CourseId: {0}", course.Id)));
        }

        [TestMethod]
        public void Publish_ShouldPostCoursePackage()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");
            var methodUrl = string.Format("serviceUrl/api/publish?key=apiKey&courseid={0}", course.Id);
            _httpContext.GetCurrentScheme().Returns("http");

            // Act
            _publisher.Publish(course);

            // Assert
            _httpClient.Received().PostFile<string>("http://" + methodUrl, course.Id.ToString(), Arg.Any<byte[]>());
        }

        [TestMethod]
        public void Publish_IfPostSuccessfulShouldUpdateCourseWithPublicationUrl()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");

            _httpContext.GetCurrentScheme().Returns("http");
            _httpClient.PostFile<string>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns("http://publicationUrl");
            
            // Act
            _publisher.Publish(course);

            // Assert
            course.PublicationUrl.Should().Be("//publicationUrl");
        }

        [TestMethod]
        public void Publish_IfPostFailedShouldLogException()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");

            var ex = new Exception();
            _httpClient.PostFile<string>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(info => { throw ex; });

            // Act
            _publisher.Publish(course);

            // Assert
            _logger.Received().LogException(ex);
        }

        public void Publish_IfPostFailedShouldResetPublicationUrl()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");

            var ex = new Exception();
            _httpClient.PostFile<string>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(info => { throw ex; });

            // Act
            _publisher.Publish(course);

            // Assert
            course.PublicationUrl.Should().BeNull();
        }

        public void Publish_IfPostFailedShouldReturnFalse()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");

            var ex = new Exception();
            _httpClient.PostFile<string>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(info => { throw ex; });

            // Act
            var result = _publisher.Publish(course);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void Publish_IfPostSuccessfulAndPublicationUrlShouldUpdateCoursePublicationUrl()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");
            _httpContext.GetCurrentScheme().Returns("http");
            _httpClient.PostFile<string>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns("http://publicationUrl");

            // Act
            var result = _publisher.Publish(course);

            // Assert
            course.PublicationUrl.Should().Be("//publicationUrl");
        }

        [TestMethod]
        public void Publish_IfPostSuccessfulAndPublicationUrlIsNotEmptyShouldReturnTrue()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");

            _httpClient.PostFile<string>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns("http://publicationUrl");

            // Act
            var result = _publisher.Publish(course);

            // Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void Publish_IfPostSuccessfulAndPublicationUrlEmptyShouldReturnTrue()
        {
            // Arrange
            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdatePackageUrl("url");

            _httpClient.PostFile<string>(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<byte[]>()).Returns(string.Empty);

            // Act
            var result = _publisher.Publish(course);

            // Assert
            result.Should().BeFalse();
        }

        #endregion

    }
}

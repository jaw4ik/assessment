using easygenerator.Infrastructure;
using easygenerator.PublicationServer.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;

namespace easygenerator.PublicationServer.Tests.Publish
{
    [TestClass]
    public class CoursePublisherTests
    {
        private CoursePublisher _coursePublisher;
        private PhysicalFileManager _physicalFileManager;
        private IPublishDispatcher _publishDispatcher;
        private PublicationPathProvider _publicationPathProvider;
        private ILog _logger;
        private string courseId = "courseId";
        private string publishedPackagePath = "published package path";
        private string uploadedPackagePath = "uploaded package path";

        [TestInitialize]
        public void InitializePublisher()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _publishDispatcher = Substitute.For<IPublishDispatcher>();
            _publicationPathProvider = Substitute.For<PublicationPathProvider>();
            _logger = Substitute.For<ILog>();

            _coursePublisher = new CoursePublisher(_physicalFileManager, _publishDispatcher, _publicationPathProvider, _logger);
        }

        [TestMethod]
        public void PublishCourse_ShouldCallDispatcherStartMethod()
        {
            // Arrange
            // Act
            _coursePublisher.PublishCourse(courseId);
            // Assert
            _publishDispatcher.Received().StartPublish(courseId);
        }

        [TestMethod]
        public void PublishCourse_ShouldDeleteOldPackage()
        {
            // Arrange
            _publicationPathProvider.GetPublishedPackageFolderPath(courseId).Returns(publishedPackagePath);

            // Act 
            _coursePublisher.PublishCourse(courseId);

            // Assert
            _physicalFileManager.Received().DeleteDirectory(publishedPackagePath);
        }

        [TestMethod]
        public void PublishCourse_ShouldExtractUploadedPckageToDestinationFolder()
        {
            // Arrange
            _publicationPathProvider.GetPublishedPackageFolderPath(courseId).Returns(publishedPackagePath);
            _publicationPathProvider.GetFilePathForUploadedPackage(courseId).Returns(uploadedPackagePath);

            // Act 
            _coursePublisher.PublishCourse(courseId);

            // Assert
            _physicalFileManager.Received().ExtractArchiveToDirectory(uploadedPackagePath, publishedPackagePath);
        }

        [TestMethod]
        public void PublishCourse_ShouldDeleteUploadedPackage()
        {
            // Arrange
            _publicationPathProvider.GetFilePathForUploadedPackage(courseId).Returns(uploadedPackagePath);

            // Act 
            _coursePublisher.PublishCourse(courseId);

            // Assert
            _physicalFileManager.Received().DeleteFile(uploadedPackagePath);
        }

        [TestMethod]
        public void PublishCourse_ShouldReturnTrueIfNoExceptions()
        {
            // Arrange
            // Act 
            var result = _coursePublisher.PublishCourse(courseId);

            // Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void PublishCourse_IfCannotDeleteFolderShouldLogException()
        {
            // Arrange
            var ex = new Exception();
            _physicalFileManager.When(_ => _.DeleteDirectory(Arg.Any<string>())).Do(_ => { throw ex; });

            // Act 
            _coursePublisher.PublishCourse(courseId);

            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void PublishCourse_IfCannotDeleteFolderReturnFalse()
        {
            // Arrange
            var ex = new Exception();
            _physicalFileManager.When(_ => _.DeleteDirectory(Arg.Any<string>())).Do(_ => { throw ex; });

            // Act 
            var result = _coursePublisher.PublishCourse(courseId);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void PublishCourse_IfCannotExtractPackageShouldLogException()
        {
            // Arrange
            var ex = new Exception();
            _physicalFileManager.When(_ => _.ExtractArchiveToDirectory(Arg.Any<string>(), Arg.Any<string>())).Do(_ => { throw ex; });

            // Act 
            _coursePublisher.PublishCourse(courseId);

            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void PublishCourse_IfCannotExtractPackageShouldReturnFalse()
        {
            // Arrange
            var ex = new Exception();
            _physicalFileManager.When(_ => _.ExtractArchiveToDirectory(Arg.Any<string>(), Arg.Any<string>())).Do(_ => { throw ex; });

            // Act 
            var result = _coursePublisher.PublishCourse(courseId);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void PublishCourse_IfCannotDeletePackageShouldLogException()
        {
            // Arrange
            var ex = new Exception();
            _physicalFileManager.When(_ => _.DeleteFile(Arg.Any<string>())).Do(_ => { throw ex; });

            // Act 
            _coursePublisher.PublishCourse(courseId);

            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void PublishCourse_IfCannotDeletePackageShouldReturnFalse()
        {
            // Arrange
            var ex = new Exception();
            _physicalFileManager.When(_ => _.DeleteFile(Arg.Any<string>())).Do(_ => { throw ex; });

            // Act 
            var result = _coursePublisher.PublishCourse(courseId);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void PublishCourse_ShouldCallEndPublishMethod()
        {
            // Arrange
            // Act 
            _coursePublisher.PublishCourse(courseId);

            // Assert
            _publishDispatcher.Received().EndPublish(courseId);
        }
    }
}

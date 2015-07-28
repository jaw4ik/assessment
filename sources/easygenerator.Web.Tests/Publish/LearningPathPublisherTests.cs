﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Publish;
using NSubstitute;

namespace easygenerator.Web.Tests.Publish
{
    [TestClass]
    public class LearningPathPublisherTests
    {
        private ILog _logger;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _pathProvider; 
        private HttpClient _httpClient;
        private ConfigurationReader _configurationReader;
        private LearningPathPublisher _publisher;

        [TestInitialize]
        public void InitializeContext()
        {
            _logger = Substitute.For<ILog>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _pathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _httpClient = Substitute.For<HttpClient>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.PublicationConfiguration.Returns(new PublicationConfigurationSection() { ApiKey = "apiKey", ServiceUrl = "serviceUrl" });
            _publisher = new LearningPathPublisher(_logger, _fileManager, _pathProvider, _httpClient, _configurationReader);
        }

        #region Publish

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenLearningPathPackageUrlIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            var result = _publisher.Publish(learningPath);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Publish_ShouldLogNotSupportedException_WhenLearningPathPackageUrlIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();

            //Act
            _publisher.Publish(learningPath);

            //Assert
            _logger.Received().LogException(Arg.Is<NotSupportedException>(ex => ex.Message == String.Format("Publishing of non builded learning path is not supported. LearningPathId: {0}", learningPath.Id)));
        }

        [TestMethod]
        public void Publish_ShouldGetLearningPathPackage()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePackageUrl("packageUrl");
            _pathProvider.GetBuildedPackagePath("packageUrl").Returns("packagePath");

            //Act
            _publisher.Publish(learningPath);

            //Assert
            _fileManager.Received().GetFileBytes("packagePath");
        }

        [TestMethod]
        public void Publish_ShouldPostLearningPathPackage()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePackageUrl("packageUrl");
            var methodUrl = string.Format("serviceUrl/api/publish?key=apiKey&courseid={0}", learningPath.Id);

            //Act
            _publisher.Publish(learningPath);

            //Assert
            _httpClient.Received().PostFile<string>(methodUrl, learningPath.Id.ToString(), Arg.Any<byte[]>());
        }

        [TestMethod]
        public void Publish_ShouldUpdateLearningPathPublicationUrl_WhenPostSucced()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePackageUrl("packageUrl");
            _httpClient.PostFile<string>(Arg.Any<string>(), learningPath.Id.ToString(), Arg.Any<byte[]>()).Returns("publicationUrl");

            //Act
            _publisher.Publish(learningPath);

            //Assert
            learningPath.PublicationUrl.Should().Be("publicationUrl");
        }

        [TestMethod]
        public void Publish_ShouldReturnTrue_WhenPostSucced()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePackageUrl("packageUrl");
            _httpClient.PostFile<string>(Arg.Any<string>(), learningPath.Id.ToString(), Arg.Any<byte[]>()).Returns("publicationUrl");

            //Act
            var result = _publisher.Publish(learningPath);

            //Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void Publish_ShouldLogInvalidOperationException_WhenPostFailed()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePackageUrl("packageUrl");
            _httpClient.PostFile<string>(Arg.Any<string>(), learningPath.Id.ToString(), Arg.Any<byte[]>()).Returns("");

            //Act
            var result = _publisher.Publish(learningPath);

            //Assert
            _logger.Received().LogException(Arg.Is<InvalidOperationException>(ex => ex.Message == String.Format("Post learning path package failed. LearningPathId: {0}", learningPath.Id)));
        }
        
        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenPostFailed()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePackageUrl("packageUrl");
            _httpClient.PostFile<string>(Arg.Any<string>(), learningPath.Id.ToString(), Arg.Any<byte[]>()).Returns("");

            //Act
            var result = _publisher.Publish(learningPath);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Publish_ShouldReturnResetPublicationUrl_WhenPostFailed()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePackageUrl("packageUrl");
            learningPath.UpdatePublicationUrl("publicationUrl");
            _httpClient.PostFile<string>(Arg.Any<string>(), learningPath.Id.ToString(), Arg.Any<byte[]>()).Returns("");

            //Act
            _publisher.Publish(learningPath);

            //Assert
            learningPath.PublicationUrl.Should().Be(null);
        }

    #endregion
    }
}

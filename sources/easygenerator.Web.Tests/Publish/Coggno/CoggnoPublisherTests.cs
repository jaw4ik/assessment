using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Extensions;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Publish.Coggno;
using NSubstitute;

namespace easygenerator.Web.Tests.Publish.Coggno
{
    [TestClass]
    public class CoggnoPublisherTests
    {
        private ILog _logger;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _pathProvider;
        private HttpClient _httpClient;
        private ConfigurationReader _configurationReader;
        private CoggnoPublisher _publisher;
        private ICoggnoPublishableEntity _entity;
        private const string PackageUrl = "packageUrl";

        [TestInitialize]
        public void InitializeContext()
        {
            _entity = Substitute.For<ICoggnoPublishableEntity>();
            _entity.Id.Returns(Guid.NewGuid());
            _entity.ScormPackageUrl.Returns(PackageUrl);

            _logger = Substitute.For<ILog>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _pathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _httpClient = Substitute.For<HttpClient>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.CoggnoConfiguration.Returns(new CoggnoConfigurationSection() { ApiKey = "apiKey", PublicationUrl = "publicationUrl" });
            _publisher = new CoggnoPublisher(_fileManager, _pathProvider, _logger, _httpClient, _configurationReader);
        }

        #region Publish

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenEntityPackageUrlIsNull()
        {
            //Arrange
            _entity.ScormPackageUrl.Returns((string)null);

            //Act
            var result = _publisher.Publish(_entity, "user", "user");

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Publish_ShouldLogInvalidOperationException_WhenEntityPackageUrlIsNull()
        {
            //Arrange
            _entity.ScormPackageUrl.Returns((string)null);

            //Act
            _publisher.Publish(_entity, "user", "user");

            //Assert
            _logger.Received().LogException(Arg.Is<InvalidOperationException>
                (ex => ex.Message == $"Entity cannot be published to coggno. Probably it was not built. EntityId: {_entity.Id.ToNString()}"));
        }

        [TestMethod]
        public void Publish_ShouldGetEntityPackage()
        {
            //Arrange
            _pathProvider.GetBuildedPackagePath(PackageUrl).Returns("packagePath");

            //Act
            _publisher.Publish(_entity, "user", "user");

            //Assert
            _fileManager.Received().GetFileBytes("packagePath");
        }

        [TestMethod]
        public void Publish_ShouldPostEntityPackage()
        {
            // Arrange
            _entity.Title.Returns("title");
            _entity.CreatedBy.Returns("createdBy");
            _entity.CreatedOn.Returns(DateTimeWrapper.Now());

            var methodUrl = "publicationUrl";

            // Act
            _publisher.Publish(_entity, "user", "user");

            // Assert
            _httpClient.Received().PostFile<string>(methodUrl, $"\"{_entity.Id.ToNString()}.zip\"", Arg.Any<byte[]>(),
                Arg.Is<IEnumerable<KeyValuePair<string, string>>>(
                    _ => _.Any(formValue => formValue.Key == "userEmail" && formValue.Value == _entity.CreatedBy) &&
                    _.Any(formValue => formValue.Key == "title" && formValue.Value == _entity.Title) &&
                    _.Any(formValue => formValue.Key == "id" && formValue.Value == _entity.Id.ToNString()) &&
                    _.Any(formValue => formValue.Key == "userFirstName" && formValue.Value == "user") &&
                    _.Any(formValue => formValue.Key == "userLastName" && formValue.Value == "user") &&
                    _.Any(formValue => formValue.Key == "category" && formValue.Value == "Unknown")
                    ),
                Arg.Is<IEnumerable<KeyValuePair<string, string>>>(_ => _.Any(formValue => formValue.Key == "X-Api-Key" && formValue.Value == "apiKey")), "\"scormPackage\"");
        }

        [TestMethod]
        public void Publish_MarkAsPublishedForSale_WhenPostSucced()
        {
            //Arrange
            var publicationUrl = "publicationUrl";

            _httpClient.PostFile<string>(Arg.Any<string>(), $"\"{_entity.Id.ToNString()}.zip\"", Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), "\"scormPackage\"")
                .Returns(publicationUrl);

            //Act
            _publisher.Publish(_entity, "user", "user");

            //Assert
            _entity.Received().MarkAsPublishedForSale();
        }

        [TestMethod]
        public void Publish_ShouldReturnTrue_WhenPostSucced()
        {
            //Arrange
            var publicationUrl = "publicationUrl";
            _httpClient.PostFile<string>(Arg.Any<string>(), $"\"{_entity.Id.ToNString()}.zip\"", Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), "\"scormPackage\"")
                .Returns(publicationUrl);

            //Act
            var result = _publisher.Publish(_entity, "user", "user");

            //Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenPostFailed()
        {
            //Arrange
            var entity = Substitute.For<ICoggnoPublishableEntity>();
            entity.Id.Returns(Guid.NewGuid());
            entity.ScormPackageUrl.Returns((string)null);
            _httpClient.PostFile<string>(Arg.Any<string>(), $"\"{_entity.Id.ToNString()}.zip\"", Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), "\"scormPackage\"")
                .Returns("");

            //Act
            var result = _publisher.Publish(entity, "user", "user");

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Publish_ShouldLogException_WhenPostFailed()
        {
            //Arrange
            var entity = Substitute.For<ICoggnoPublishableEntity>();
            entity.Id.Returns(Guid.NewGuid());
            entity.ScormPackageUrl.Returns((string)null);
            _httpClient.PostFile<string>(Arg.Any<string>(), $"\"{_entity.Id.ToNString()}.zip\"", Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), "\"scormPackage\"")
                .Returns("");

            //Act
            _publisher.Publish(entity, "user", "user");

            //Assert
            _logger.Received().LogException(Arg.Any<Exception>());
        }

        #endregion
    }
}
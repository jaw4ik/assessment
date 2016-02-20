using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using easygenerator.DomainModel.Entities;
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
    public class EntityPublisherTests
    {
        private IUrlHelperWrapper _urlHelper;
        private ILog _logger;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _pathProvider;
        private HttpClient _httpClient;
        private ConfigurationReader _configurationReader;
        private EntityPublisher _publisher;
        private IPublishableEntity _entity;
        private string packageUrl = "packageUrl";

        [TestInitialize]
        public void InitializeContext()
        {
            _entity = Substitute.For<IPublishableEntity>();
            _entity.Id.Returns(Guid.NewGuid());
            _entity.PackageUrl.Returns(packageUrl);

            _logger = Substitute.For<ILog>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _pathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _httpClient = Substitute.For<HttpClient>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.PublicationConfiguration.Returns(new PublicationConfigurationSection() { ApiKey = "apiKey", ServiceUrl = "serviceUrl" });
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _publisher = new EntityPublisher(_urlHelper, _fileManager, _pathProvider, _logger, _httpClient, _configurationReader);
        }

        #region Publish

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenEntityPackageUrlIsNull()
        {
            //Arrange
            _entity.PackageUrl.Returns((string)null);

            //Act
            var result = _publisher.Publish(_entity);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Publish_ShouldLogInvalidOperationException_WhenEntityPackageUrlIsNull()
        {
            //Arrange
            _entity.PackageUrl.Returns((string)null);

            //Act
            _publisher.Publish(_entity);

            //Assert
            _logger.Received().LogException(Arg.Is<InvalidOperationException>
                (ex => ex.Message == $"Entity cannot be published. Probably it was not built. EntityId: {_entity.Id}"));
        }

        [TestMethod]
        public void Publish_ShouldGetEntityPackage()
        {
            //Arrange
            _pathProvider.GetBuildedPackagePath(packageUrl).Returns("packagePath");

            //Act
            _publisher.Publish(_entity);

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

            var methodUrl = $"serviceUrl/api/publish/{_entity.Id}";
            _urlHelper.AddCurrentSchemeToUrl(methodUrl).Returns("http://" + methodUrl);

            // Act
            _publisher.Publish(_entity);

            // Assert
            _httpClient.Received().PostFile<string>("http://" + methodUrl, _entity.Id.ToString(), Arg.Any<byte[]>(),
                Arg.Is<IEnumerable<KeyValuePair<string, string>>>(
                    _ => _.Any(formValue => formValue.Key == "ownerEmail" && formValue.Value == _entity.CreatedBy) &&
                    _.Any(formValue => formValue.Key == "title" && formValue.Value == _entity.Title) &&
                    _.Any(formValue => formValue.Key == "createdDate" && formValue.Value == _entity.CreatedOn.ToString(CultureInfo.InvariantCulture))
                    ),
                Arg.Is<IEnumerable<KeyValuePair<string, string>>>(_ => _.Any(formValue => formValue.Key == "key" && formValue.Value == "apiKey")));
        }

        [TestMethod]
        public void Publish_ShouldUpdateEntityPublicationUrl_WhenPostSucced()
        {
            //Arrange
            var publicationUrl = "//publicationUrl";

            _httpClient.PostFile<string>(Arg.Any<string>(), _entity.Id.ToString(), Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>())
                .Returns("http:" + publicationUrl);
            _urlHelper.RemoveSchemeFromUrl("http:" + publicationUrl).Returns(publicationUrl);

            //Act
            _publisher.Publish(_entity);

            //Assert
            _entity.Received().UpdatePublicationUrl(publicationUrl);
        }

        [TestMethod]
        public void Publish_ShouldReturnTrue_WhenPostSucced()
        {
            //Arrange
            var publicationUrl = "//publicationUrl";
            _httpClient.PostFile<string>(Arg.Any<string>(), _entity.Id.ToString(), Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>())
                .Returns("http:" + publicationUrl);
            _urlHelper.RemoveSchemeFromUrl("http:" + publicationUrl).Returns(publicationUrl);

            //Act
            var result = _publisher.Publish(_entity);

            //Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void Publish_ShouldLogInvalidOperationException_WhenPostFailed()
        {
            //Arrange
            _httpClient.PostFile<string>(Arg.Any<string>(), _entity.Id.ToString(), Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>())
                .Returns("");

            //Act
            var result = _publisher.Publish(_entity);

            //Assert
            _logger.Received().LogException(Arg.Is<InvalidOperationException>(ex => ex.Message ==
                                                                                    $"Publication failed, publication url is empty. EntityId: {_entity.Id}"));
        }

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenPostFailed()
        {
            //Arrange
            _httpClient.PostFile<string>(Arg.Any<string>(), _entity.Id.ToString(), Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>())
                .Returns("");

            //Act
            var result = _publisher.Publish(_entity);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Publish_ShouldReturnResetPublicationUrl_WhenPostFailed()
        {
            //Arrange
            _httpClient.PostFile<string>(Arg.Any<string>(), _entity.Id.ToString(), Arg.Any<byte[]>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>(), Arg.Any<IEnumerable<KeyValuePair<string, string>>>())
                .Returns("");

            //Act
            _publisher.Publish(_entity);

            //Assert
            _entity.Received().ResetPublicationUrl();
        }

        #endregion
    }
}
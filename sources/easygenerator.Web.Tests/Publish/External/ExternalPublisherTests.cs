using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Publish.External;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Tests.Utils;

namespace easygenerator.Web.Tests.Publish.External
{
    [TestClass]
    public class ExternalPublisherTests
    {
        private ILog _logger;
        private HttpClient _httpClient;
        private ExternalPublisher _publisher;
        private IPublishableEntity _entity;
        private string _publicationUrl = "publicationUrl";

        [TestInitialize]
        public void InitializeContext()
        {
            _entity = Substitute.For<IPublishableEntity>();
            _entity.PublicationUrl.Returns(_publicationUrl);

            _logger = Substitute.For<ILog>();
            _httpClient = Substitute.For<HttpClient>();
            _publisher = new ExternalPublisher(_httpClient, _logger);
        }

        #region Publish

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenPackageUrlIsNull()
        {
            //Arrange
            _entity.PublicationUrl.Returns((string)null);
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            var result = _publisher.Publish(_entity, company, userEmail);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Publish_ShouldLogInvalidOperationException_WhenPublicationUrlIsNull()
        {
            //Arrange
            _entity.PublicationUrl.Returns((string)null);
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            var result = _publisher.Publish(_entity, company, userEmail);

            //Assert
            _logger.Received().LogException(Arg.Is<InvalidOperationException>(ex => ex.Message == $"Entity was not published (PublicationUrl is empty). Entity id: {_entity.Id}."));
        }

        [TestMethod]
        public void Publish_ShouldPostPackageUrl()
        {
            //Arrange
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            _publisher.Publish(_entity, company, userEmail);

            //Assert
            _httpClient.Received().Post<string>(company.PublishCourseApiUrl, Arg.Is<object>((_) => _.IsObjectSimilarTo(new
            {
                id = _entity.Id.ToString("N"),
                userEmail = userEmail,
                publishedCourseUrl = _entity.PublicationUrl,
                apiKey = company.SecretKey
            })));
        }

        [TestMethod]
        public void Publish_ShouldSetPublishedToExternalLms_WhenPostSucced()
        {
            //Arrange
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            _publisher.Publish(_entity, company, userEmail);

            //Assert
            _entity.Received().SetPublishedToExternalLms(company);
        }

        [TestMethod]
        public void Publish_ShouldReturnTrue_WhenPostSucced()
        {
            //Arrange
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            var result = _publisher.Publish(_entity, company, userEmail);

            //Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void Publish_ShouldLogException_WhenPostFailed()
        {
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";
            var ex = new Exception();

            _httpClient.Post<string>(company.PublishCourseApiUrl, Arg.Any<object>()).Returns(info => { throw ex; });

            //Act
            _publisher.Publish(_entity, company, userEmail);

            //Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenPostFailed()
        {
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";
            _httpClient.Post<string>(company.PublishCourseApiUrl, Arg.Any<object>()).Returns(info => { throw new Exception(); });

            //Act
            var result = _publisher.Publish(_entity, company, userEmail);

            //Assert
            result.Should().Be(false);
        }

        #endregion

    }
}

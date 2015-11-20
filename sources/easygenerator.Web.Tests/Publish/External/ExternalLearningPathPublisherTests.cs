using System;
using System.Activities.Statements;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.WebPages;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Publish.External;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Tests.Publish.External
{
    [TestClass]
    public class ExternalLearningPathPublisherTests
    {
        private ILog _logger;
        private HttpClient _httpClient;
        private ExternalLearningPathPublisher _publisher;

        [TestInitialize]
        public void InitializeContext()
        {
            _logger = Substitute.For<ILog>();
            _httpClient = Substitute.For<HttpClient>();
            _publisher = new ExternalLearningPathPublisher(_httpClient, _logger);
        }

        #region Publish

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenLearningPathPackageUrlIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            var result = _publisher.Publish(learningPath, company, userEmail);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Publish_ShouldLogNotSupportedException_WhenLearningPathPublicationUrlIsNull()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            var result = _publisher.Publish(learningPath, company, userEmail);

            //Assert
            _logger.Received().LogException(Arg.Is<NotSupportedException>(ex => ex.Message == String.Format("Learning path with Id: {0} doesn't have PublicationUrl.", learningPath.Id)));
        }

        [TestMethod]
        public void Publish_ShouldPostLearningPathPackageUrl()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePublicationUrl("publicationUrl");
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            _publisher.Publish(learningPath, company, userEmail);

            //Assert
            _httpClient.Received().Post<string>(company.PublishCourseApiUrl, Arg.Any<object>());
        }

        [TestMethod]
        public void Publish_ShouldSetPublishedToExternalLms_WhenPostSucced()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePublicationUrl("publicationUrl");
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";
            
            //Act
            _publisher.Publish(learningPath, company, userEmail);

            //Assert
            learningPath.IsPublishedToExternalLms.Should().Be(true);
        }

        [TestMethod]
        public void Publish_ShouldReturnTrue_WhenPostSucced()
        {
            //Arrange
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePublicationUrl("publicationUrl");
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";

            //Act
            var result = _publisher.Publish(learningPath, company, userEmail);

            //Assert
            result.Should().Be(true);
        }

        [TestMethod]
        public void Publish_ShouldLogException_WhenPostFailed()
        {
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePublicationUrl("publicationUrl");
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";
            var ex = new Exception();

            _httpClient.Post<string>(company.PublishCourseApiUrl, Arg.Any<object>()).Returns(info => { throw ex; });

            //Act
           _publisher.Publish(learningPath, company, userEmail);

            //Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void Publish_ShouldReturnFalse_WhenPostFailed()
        {
            var learningPath = LearningPathObjectMother.Create();
            learningPath.UpdatePublicationUrl("publicationUrl");
            var company = CompanyObjectMother.Create();
            var userEmail = "userEmail";
            _httpClient.Post<string>(company.PublishCourseApiUrl, Arg.Any<object>()).Returns(info => { throw new Exception(); });

            //Act
            var result = _publisher.Publish(learningPath, company, userEmail);

            //Assert
            result.Should().Be(false);
        }

        #endregion

    }
}

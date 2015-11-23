using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Publish.External;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Publish.External
{
    [TestClass]
    public class ExternalCoursePublisherTests
    {
        private ILog _logger;
        private HttpClient _httpClient;
        private ExternalCoursePublisher _publisher;
        private const string userEmail = "userEmail";

        [TestInitialize]
        public void Init()
        {
            _logger = Substitute.For<ILog>();
            _httpClient = Substitute.For<HttpClient>();
            _publisher = new ExternalCoursePublisher(_httpClient, _logger);
        }

        [TestMethod]
        public void PublishCourseUrl_ShouldLogAnError_IfCourseWasNotPublished()
        {
            var course = CourseObjectMother.Create();
            var company = new DomainModel.Entities.Company();

            _publisher.PublishCourseUrl(course, company, userEmail);
            _logger.Received().LogException(Arg.Is<Exception>(_ => _.Message.Equals("Course is already not published.")));
        }

        [TestMethod]
        public void PublishCourseUrl_ShouldReturnFalse_IfCourseWasNotPublished()
        {
            var course = CourseObjectMother.Create();
            var company = new DomainModel.Entities.Company();

            var result = _publisher.PublishCourseUrl(course, company, userEmail);
            result.Should().BeFalse();
        }

        [TestMethod]
        public void PublishCourseUrl_ShouldPostCorrectDataToExternalAPI()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            var company = CompanyObjectMother.Create();

            _publisher.PublishCourseUrl(course, company, userEmail);

            _httpClient.Received()
                .Post<string>(
                company.PublishCourseApiUrl,
                Arg.Is<object>((_) => _.IsObjectSimilarTo(new
                {
                    id = course.Id.ToString("N"),
                    userEmail = userEmail,
                    publishedCourseUrl = course.PublicationUrl,
                    apiKey = company.SecretKey
                })
                ));
        }

        [TestMethod]
        public void PublishCourseUrl_ShouldSetPublishedToExternalLmsToTrue()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            var company = CompanyObjectMother.Create();

            _publisher.PublishCourseUrl(course, company, userEmail);

            course.IsPublishedToExternalLms.Should().BeTrue();
        }

        [TestMethod]
        public void PublishCourseUrl_ShouldReturnTrueIfSucess()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            var company = CompanyObjectMother.Create();

            var result = _publisher.PublishCourseUrl(course, company, userEmail);

            result.Should().BeTrue();
        }

        [TestMethod]
        public void PublishCourseUrl_ShouldLogAnError_IfExceptionOccured()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");
            var exception = new Exception();
            var company = CompanyObjectMother.Create();

            _httpClient.Post<string>(company.PublishCourseApiUrl, Arg.Any<object>()).Returns(_ => { throw exception; });

            _publisher.PublishCourseUrl(course, company, userEmail);

            _logger.Received().LogException(exception);
        }

        [TestMethod]
        public void PublishCourseUrl_ShouldReturnFalse_IfErrorOccured()
        {
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");
            var exception = new Exception();
            var company = CompanyObjectMother.Create();

            _httpClient.Post<string>(company.PublishCourseApiUrl, Arg.Any<object>()).Returns(_ => { throw exception; });

            var result = _publisher.PublishCourseUrl(course, company, userEmail);

            result.Should().BeFalse();
        }
    }
}

using System;
using System.Net;
using easygenerator.Infrastructure.DomainModel;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Mail;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Infrastructure.Tests.Http
{
    [TestClass]
    public class HttpRequestsManagerTests
    {
        private IHttpRequestsManager _httpRequestManager;
        private IUnitOfWork _unitOfWork;
        private IHttpRequestsRepository _httpRequestsRepository;
        private HttpClient _httpClient;
        private ILog _logger;
        private IMailNotificationManager _mailNotificationManager;


        [TestInitialize]
        public void InitializeManagee()
        {
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _httpRequestsRepository = Substitute.For<IHttpRequestsRepository>();
            _httpClient = Substitute.For<HttpClient>();
            _mailNotificationManager = Substitute.For<IMailNotificationManager>();
            _logger = Substitute.For<ILog>();

            _httpRequestManager = new HttpRequestsManager(_httpRequestsRepository, _unitOfWork, _httpClient, _logger, _mailNotificationManager);
        }

        [TestMethod]
        public void PostOrAddToQueueIfUnexpectedError_ShouldPostData()
        {
            // Arrange
            var url = "url";
            var postData = new object();

            // Act 
            _httpRequestManager.PostOrAddToQueueIfUnexpectedError(url, postData, "serviceName");

            // Assert
            _httpClient.Received().Post<string>(url, postData);
        }

        [TestMethod]
        public void PostOrAddToQueueIfUnexpectedError_ShouldLogExceptionIfItOccurs()
        {
            Exception ex = new Exception();
            // Arrange
            _httpClient.Post<string>(Arg.Any<string>(), Arg.Any<object>()).Returns((_) => { throw ex; });

            // Act
            _httpRequestManager.PostOrAddToQueueIfUnexpectedError("url", new object(), "serviceName");

            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void PostOrAddToQueueIfUnexpectedError_ShouldAddRequestToQueueIfUnexpectedError()
        {
            // Arrange
            var url = "url";
            var postData = new { property = "value" };
            var serviceName = "serviceName";
            var reportOnFailure = false;

            _httpClient.Post<string>(Arg.Any<string>(), Arg.Any<object>()).Returns(_ => { throw new Exception(); });

            // Act
            _httpRequestManager.PostOrAddToQueueIfUnexpectedError(url, postData, serviceName, reportOnFailure);

            // Assert
            _httpRequestsRepository.Received().Add(Arg.Is<HttpRequest>(request => request.Url == url && request.Verb == "POST" && request.Content == "{\"property\":\"value\"}"
                && request.ServiceName == serviceName && request.ReportOnFailure == reportOnFailure));
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void PostOrAddToQueueIfUnexpectedError_ShouldNotAddRequestToQueueIfNotUnexpectedError()
        {
            // Arrange
            var ex = new HttpRequestExceptionExtended(string.Empty, string.Empty, string.Empty, HttpStatusCode.BadRequest,
                string.Empty, string.Empty);

            _httpClient.Post<string>(Arg.Any<string>(), Arg.Any<object>()).Returns(_ => { throw ex; });

            // Act
            _httpRequestManager.PostOrAddToQueueIfUnexpectedError(string.Empty, null, string.Empty);

            // Assert
            _httpRequestsRepository.DidNotReceive().Add(Arg.Any<HttpRequest>());
            _unitOfWork.DidNotReceive().Save();
        }

        [TestMethod]
        public void PostOrAddToQueueIfUnexpectedError_ShouldSendMailIfNotUnexpectedErrorAndRequestReportIsTrue()
        {
            // Arrange
            var ex = new HttpRequestExceptionExtended(string.Empty, string.Empty, string.Empty, HttpStatusCode.BadRequest,
                string.Empty, string.Empty);

            _httpClient.Post<string>(Arg.Any<string>(), Arg.Any<object>()).Returns(_ => { throw ex; });

            // Act
            _httpRequestManager.PostOrAddToQueueIfUnexpectedError(string.Empty, null, string.Empty);

            // Assert
            _mailNotificationManager.Received()
                .AddMailNotificationToQueue(Constants.MailTemplates.HttpRequestFailedTemplate, Arg.Any<object>());
        }

        [TestMethod]
        public void PostOrAddToQueueIfUnexpectedError_ShouldNotSendMailIfNotUnexpectedErrorAndRequestReportIsFalse()
        {
            // Arrange
            var ex = new HttpRequestExceptionExtended(string.Empty, string.Empty, string.Empty, HttpStatusCode.BadRequest,
                string.Empty, string.Empty);

            _httpClient.Post<string>(Arg.Any<string>(), Arg.Any<object>()).Returns(_ => { throw ex; });

            // Act
            _httpRequestManager.PostOrAddToQueueIfUnexpectedError(string.Empty, null, string.Empty, false);

            // Assert
            _mailNotificationManager.DidNotReceive()
                .AddMailNotificationToQueue(Arg.Any<string>(), Arg.Any<object>());
        }
    }
}
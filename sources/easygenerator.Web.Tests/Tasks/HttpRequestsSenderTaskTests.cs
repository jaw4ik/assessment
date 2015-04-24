using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Mail;
using easygenerator.Infrastructure.Tests.ObjectMothers;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Tasks;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using HttpClient = easygenerator.Infrastructure.Http.HttpClient;
using HttpRequest = easygenerator.Infrastructure.DomainModel.HttpRequest;

namespace easygenerator.Web.Tests.Tasks
{
    [TestClass]
    public class HttpRequestsSenderTaskTests
    {
        private HttpRequestsSenderTask _httpRequestsSenderTask;
        private IHttpRequestsRepository _httpRequestsRepository;
        private IMailNotificationManager _mailNotificationManager;
        private HttpClient _httpClient;
        private ConfigurationReader _configurationReader;
        private HttpRequestsSenderConfigurationSection _configurationSection;
        private ICollection<HttpRequest> _requests;
        private ILog _logger;

        [TestInitialize]
        public void InitializeTask()
        {
            _httpRequestsRepository = Substitute.For<IHttpRequestsRepository>();
            _mailNotificationManager = Substitute.For<IMailNotificationManager>();
            _httpClient = Substitute.For<HttpClient>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationSection = new HttpRequestsSenderConfigurationSection();
            _configurationReader.HttpRequestsSenderConfiguration.Returns(_configurationSection);
            _logger = Substitute.For<ILog>();
            _httpRequestsSenderTask = new HttpRequestsSenderTask(_httpRequestsRepository, _mailNotificationManager, _httpClient, _configurationReader, _logger);

            _requests = new Collection<HttpRequest>();
        }

        [TestMethod]
        public void Execute_ShouldGetRequestsFromRepositoryWithValuesFromConfiguration()
        {
            // Arrange
            _configurationSection.BatchSize = 15;
            _configurationSection.SendAttemptsLimit = 15;
            // Act
            _httpRequestsSenderTask.Execute();
            // Assert
            _httpRequestsRepository.Received().GetCollection(15, 15);
        }

        [TestMethod]
        [ExpectedException(typeof(NotImplementedException))]
        public void Execute_ShouldThrowExceptionIfVerbOfHttpRequestIsNotPost()
        {
            // Arrange 
            _requests.Add(HttpRequestObjectMother.CreateWithVerb("GET"));
            _httpRequestsRepository.GetCollection(10, 10).Returns(_requests);

            // Act & Assert
            _httpRequestsSenderTask.Execute();
        }

        [TestMethod]
        public void Execute_ShouldCallHttpClientPostMethodWithRequestData()
        {
            // Arrange
            var httpRequest = HttpRequestObjectMother.CreateWithVerb("POST");
            _requests.Add(httpRequest);
            _httpRequestsRepository.GetCollection(10, 10).Returns(_requests);

            // Act
            _httpRequestsSenderTask.Execute();

            // Assert
            _httpClient.Received().Post<object>(httpRequest.Url, httpRequest.Content);
        }

        [TestMethod]
        public void Execute_ShouldRemoveHttpRequestIfPostWasSuccessfull()
        {
            // Arrange
            var httpRequest = HttpRequestObjectMother.CreateWithVerb("POST");
            _requests.Add(httpRequest);
            _httpRequestsRepository.GetCollection(10, 10).Returns(_requests);

            // Act
            _httpRequestsSenderTask.Execute();

            // Assert
            _httpRequestsRepository.Received().Remove(httpRequest);
        }

        [TestMethod]
        public void Execute_ShouldNotRemoveHttpRequestIfPostThrownException()
        {
            // Arrange
            var httpRequest = HttpRequestObjectMother.CreateWithVerb("POST");
            _requests.Add(httpRequest);
            _httpRequestsRepository.GetCollection(10, 10).Returns(_requests);
            _httpClient.Post<object>(Arg.Any<string>(), Arg.Any<string>()).Returns(callInfo => { throw new Exception(); });

            // Act
            _httpRequestsSenderTask.Execute();

            // Assert
            _httpRequestsRepository.DidNotReceive().Remove(httpRequest);
        }

        [TestMethod]
        public void Execute_ShouldLogExceptionIfPostFailed()
        {
            // Arrange
            var httpRequest = HttpRequestObjectMother.CreateWithVerb("POST");
            _requests.Add(httpRequest);
            _httpRequestsRepository.GetCollection(10, 10).Returns(_requests);
            var ex = new Exception();
            _httpClient.Post<object>(Arg.Any<string>(), Arg.Any<string>()).Returns(callInfo => { throw ex; });

            // Act
            _httpRequestsSenderTask.Execute();

            // Assert
            _logger.Received().LogException(ex);
        }

        [TestMethod]
        public void Execute_ShouldIncreaseSendAttemptsIfPostFailed()
        {
            // Arrange
            var httpRequest = HttpRequestObjectMother.CreateWithVerb("POST");
            _requests.Add(httpRequest);
            _httpRequestsRepository.GetCollection(10, 10).Returns(_requests);
            _httpClient.Post<object>(Arg.Any<string>(), Arg.Any<string>()).Returns(callInfo => { throw new Exception(); });

            // Act
            _httpRequestsSenderTask.Execute();

            // Assert
            httpRequest.SendAttempts.Should().Be(1);
        }


        [TestMethod]
        public void Execute_ShouldAddMailNotificationIfAttempsReachLimitAndReportValueIsTrue()
        {
            // Arrange
            _configurationSection.SendAttemptsLimit = 5;

            var httpRequest = HttpRequestObjectMother.CreateWithVerb("POST", true);
            httpRequest.IncreaseSendAttempt();
            httpRequest.IncreaseSendAttempt();
            httpRequest.IncreaseSendAttempt();
            httpRequest.IncreaseSendAttempt();

            _requests.Add(httpRequest);
            _httpRequestsRepository.GetCollection(10, 5).Returns(_requests);
            _httpClient.Post<object>(Arg.Any<string>(), Arg.Any<string>()).Returns(callInfo => { throw new Exception(); });

            // Act
            _httpRequestsSenderTask.Execute();

            // Assert
            _mailNotificationManager.Received().AddMailNotificationToQueue(Constants.MailTemplates.HttpRequestFailedTemplate, httpRequest);
        }

        [TestMethod]
        public void Execute_ShouldNotAddMailNotificationIfAttempsAreNotReached()
        {
            // Arrange
            var httpRequest = HttpRequestObjectMother.CreateWithVerb("POST", true);
            httpRequest.IncreaseSendAttempt();

            _requests.Add(httpRequest);
            _httpRequestsRepository.GetCollection(10, 10).Returns(_requests);
            _httpClient.Post<object>(Arg.Any<string>(), Arg.Any<string>()).Returns(callInfo => { throw new Exception(); });

            // Act
            _httpRequestsSenderTask.Execute();

            // Assert
            _mailNotificationManager.DidNotReceive().AddMailNotificationToQueue(Constants.MailTemplates.HttpRequestFailedTemplate, httpRequest);
        }

        [TestMethod]
        public void Execute_ShouldNotAddMailNotificationIfReportValueIfFalsed()
        {
            // Arrange
            _configurationSection.SendAttemptsLimit = 5;

            var httpRequest = HttpRequestObjectMother.CreateWithVerb("POST");
            httpRequest.IncreaseSendAttempt();
            httpRequest.IncreaseSendAttempt();
            httpRequest.IncreaseSendAttempt();
            httpRequest.IncreaseSendAttempt();

            _requests.Add(httpRequest);
            _httpRequestsRepository.GetCollection(10, 5).Returns(_requests);
            _httpClient.Post<object>(Arg.Any<string>(), Arg.Any<string>()).Returns(callInfo => { throw new Exception(); });

            // Act
            _httpRequestsSenderTask.Execute();

            // Assert
            _mailNotificationManager.DidNotReceive().AddMailNotificationToQueue(Constants.MailTemplates.HttpRequestFailedTemplate, httpRequest);
        }

    }
}

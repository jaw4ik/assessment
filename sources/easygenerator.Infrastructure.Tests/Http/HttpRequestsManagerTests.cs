using System;
using easygenerator.Infrastructure.DomainModel;
using easygenerator.Infrastructure.Http;
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

        [TestInitialize]
        public void InitializeManagee()
        {
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _httpRequestsRepository = Substitute.For<IHttpRequestsRepository>();
            _httpRequestManager = new HttpRequestsManager(_httpRequestsRepository, _unitOfWork);
        }

        [TestMethod]
        public void AddHttpRequestToQueue_ShouldAddRequestToRepository()
        {
            // Arrange
            string url = "url";
            string verb = "verb";
            string content = "content";
            string serviceName = "serviceName";
            bool report = false;
            
            // Act
            _httpRequestManager.AddHttpRequestToQueue(url, verb, content, serviceName, report);

            // Assert
            _httpRequestsRepository.Received().Add(Arg.Is<HttpRequest>(_ => _.Url == url && _.Verb == verb && _.Content == content
                && _.ServiceName == serviceName && _.ReportOnFailure == report));
        }

        [TestMethod]
        public void AddHttpRequestToQueue_ShouldSaveUnitOfWork()
        {
            // Arrange
            string url = "url";
            string verb = "verb";
            string content = "content";
            string serviceName = "serviceName";
            bool report = false;

            // Act
            _httpRequestManager.AddHttpRequestToQueue(url, verb, content, serviceName, report);

            // Assert
            _unitOfWork.Received().Save();
        }
    }
}
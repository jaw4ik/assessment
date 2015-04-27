using System;
using easygenerator.Infrastructure.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Infrastructure.Tests.DomainModel
{
    [TestClass]
    public class HttpRequestTests
    {
        [TestMethod]
        public void HttpRequest_ShoulThrowArgumentNullException_WhenUrlIsNull()
        {
            //Arrange
            Action action = () => HttpRequestObjectMother.CreateWithUrl(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("url");
        }

        [TestMethod]
        public void HttpRequest_ShoulThrowArgumentException_WhenUrlIsEmpty()
        {
            //Arrange
            Action action = () => HttpRequestObjectMother.CreateWithUrl(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("url");
        }

        [TestMethod]
        public void HttpRequest_ShoulThrowArgumentNullException_WhenVerbIsNull()
        {
            //Arrange
            Action action = () => HttpRequestObjectMother.CreateWithVerb(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("verb");
        }

        [TestMethod]
        public void HttpRequest_ShoulThrowArgumentException_WhenVerbIsEmpty()
        {
            //Arrange
            Action action = () => HttpRequestObjectMother.CreateWithVerb(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("verb");
        }


        [TestMethod]
        public void HttpRequest_ShoulThrowArgumentNullException_WhenContentIsNull()
        {
            //Arrange
            Action action = () => HttpRequestObjectMother.CreateWithContent(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("content");
        }

        [TestMethod]
        public void HttpRequest_ShoulThrowArgumentException_WhenContentIsEmpty()
        {
            //Arrange
            Action action = () => HttpRequestObjectMother.CreateWithContent(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("content");
        }

        [TestMethod]
        public void HttpRequest_ShoulThrowArgumentNullException_WhenServiceNameIsNull()
        {
            //Arrange
            Action action = () => HttpRequestObjectMother.CreateWithServiceName(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("serviceName");
        }

        [TestMethod]
        public void HttpRequest_ShoulThrowArgumentException_WhenServiceNameIsEmpty()
        {
            //Arrange
            Action action = () => HttpRequestObjectMother.CreateWithServiceName(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("serviceName");
        }

        [TestMethod]
        public void HttRequest_ShouldCreateHttRequest()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var url = "url";
            var verb = "verb";
            var content = "content";
            var serviceName = "serviceName";
            var report = false;
            
            //Act
            var httpRequest = HttpRequestObjectMother.Create(url, verb, content, serviceName, report);

            //Assert
            httpRequest.Id.Should().NotBeEmpty();
            httpRequest.CreatedOn.Should().Be(DateTime.MaxValue);
            httpRequest.Url.Should().Be(url);
            httpRequest.Verb.Should().Be(verb);
            httpRequest.Content.Should().Be(content);
            httpRequest.ServiceName.Should().Be(serviceName);
            httpRequest.ReportOnFailure.Should().Be(report);
            httpRequest.SendAttempts.Should().Be(0);
        }

        [TestMethod]
        public void HttRequest_IncreaseSendAttemptShouldIncreasySendAttemptByOne()
        {
            //Arrange
            var url = "url";
            var verb = "verb";
            var content = "content";
            var serviceName = "serviceName";
            var httpRequest = HttpRequestObjectMother.Create(url, verb, content, serviceName);

            //Act
            httpRequest.IncreaseSendAttempt();

            //Assert
            httpRequest.SendAttempts.Should().Be(1);
        }
    }
}
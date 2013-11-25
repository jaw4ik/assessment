using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Mail;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class FeedbackControllerTests
    {
        private IDomainEventPublisher<UserFeedbackEvent> _publisher;
        private FeedbackController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _publisher = Substitute.For<IDomainEventPublisher<UserFeedbackEvent>>();
            _controller = new FeedbackController(_publisher);
        }

        [TestMethod]
        public void SendFeedback_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var email = "user@easygenerator.com";
            var message = "some message from user";

            //Act
            var result = _controller.SendFeedback(email, message);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void SendFeedback_ShoulSendUserFeedback()
        {
            //Arrange
            var email = "user@easygenerator.com";
            var message = "some message from user";

            //Act
            _controller.SendFeedback(email, message);

            //Assert
            _publisher.Received().Publish(
                Arg.Is<UserFeedbackEvent>(_ => _.Email == email && _.Message == message)
                );
        }

        [TestMethod]
        public void SendFeedback_ShouldThrowError_WhenFeedbackMessageEmpty()
        {
            //Arrange
            var email = "user@easygenerator.com";
            var message = "";

            //Act
            Action action = () => _controller.SendFeedback(email, message);

            //Assert
            action.ShouldThrow<ArgumentException>();

        }
    }
}

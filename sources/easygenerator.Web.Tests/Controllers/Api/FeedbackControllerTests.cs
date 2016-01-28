using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class FeedbackControllerTests
    {
        private IDomainEventPublisher _publisher;
        private FeedbackController _controller;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _controller = new FeedbackController(_publisher);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region SendFeedback

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

        #endregion

        #region SendNewEditorFeedback

        [TestMethod]
        public void SendNewEditorFeedback_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var rate = 5;
            var message = "some message from user";

            //Act
            var result = _controller.SendNewEditorFeedback(rate, message);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void SendNewEditorFeedback_ShoulSendUserFeedback()
        {
            //Arrange
            var rate = 5;
            var message = "some message from user";

            //Act
            _controller.SendNewEditorFeedback(rate, message);

            //Assert
            _publisher.Received().Publish(
                Arg.Is<NewEditorUserFeedbackEvent>(_ => _.Rate == rate && _.Message == message)
                );
        }

        #endregion
    }
}

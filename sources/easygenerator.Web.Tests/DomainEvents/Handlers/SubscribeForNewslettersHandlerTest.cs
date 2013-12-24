using System;
using System.Activities.Expressions;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.DomainEvents.Handlers;
using easygenerator.Web.Newsletter;
using easygenerator.Web.Mail;
using NSubstitute;
using easygenerator.DomainModel;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Tests.DomainEvents.Handlers
{
    [TestClass]
    public class SubscribeForNewslettersHandlerTest
    {
        private SubscribeForNewslettersHandler _handler;
        private INewsletterSubscriptionManager _subscriptionManager;
        private IMailNotificationManager _mailNotificationManager;
        private User _user;

        [TestInitialize]
        public void InitializeHandler()
        {
            _subscriptionManager = Substitute.For<INewsletterSubscriptionManager>();
            _mailNotificationManager = Substitute.For<IMailNotificationManager>();
            _user = new EntityFactory().User("test@easygenerator.com", "abcABC123", "fullName", "phone", "organization", "country", "createdBy");

            _handler = new SubscribeForNewslettersHandler(_subscriptionManager, _mailNotificationManager);
        }

        [TestMethod]
        public void Handle_ShouldCallSubscribeForNewslettersMethodWithCorrectEmail()
        {
            // Arrange
            var eventArgs = new UserSignedUpEvent(_user, "", "", "");

            // Act
            _handler.Handle(eventArgs);

            // Assert
            _subscriptionManager.Received().SubscribeForNewsletters(_user.Email, _user.FullName);
        }

        [TestMethod]
        public void Handle_ShouldSendNewsletterSubscriptionFailedMessage_IfSubscriptionMethodReturnedFalse()
        {
            // Arrange
            var eventArgs = new UserSignedUpEvent(_user, "", "", "");
            _subscriptionManager.SubscribeForNewsletters(_user.Email, _user.FullName).Returns(false);
            // Act
            _handler.Handle(eventArgs);

            // Assert
            _mailNotificationManager.Received().AddMailNotificationToQueue(Constants.MailTemplates.NewsletterSubscriptionFailedTemplate, Arg.Any<object>());
        }

        [TestMethod]
        public void Handle_ShouldNotSendNewsletterSubscriptionFailedMessage_IfSubscriptionMethodReturnedFalse()
        {
            // Arrange
            var eventArgs = new UserSignedUpEvent(_user, "", "", "");
            _subscriptionManager.SubscribeForNewsletters(_user.Email, _user.FullName).Returns(true);
            // Act
            _handler.Handle(eventArgs);

            // Assert
            _mailNotificationManager.DidNotReceive().AddMailNotificationToQueue(Constants.MailTemplates.NewsletterSubscriptionFailedTemplate, Arg.Any<object>());
        }
    }
}

using easygenerator.Infrastructure;
using easygenerator.Infrastructure.DomainModel;
using easygenerator.Infrastructure.Mail;
using easygenerator.Infrastructure.Tests.ObjectMothers;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.MailSender;
using easygenerator.Web.Mail;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.Tasks
{
    [TestClass]
    public class MailSenderTaskTest
    {
        private MailSenderTask _mailSenderTask;
        private IMailNotificationRepository _mailNotificationRepository;
        private IMailSender _mailSender;
        private MailSettings _mailSettings;
        private MailSenderConfigurationSection _mailSenderConfiguration;
        private ConfigurationReader _configurationReader;

        [TestInitialize]
        public void InitializePublisher()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;

            _mailSenderConfiguration = new MailSenderConfigurationSection();

            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.MailSenderConfiguration.Returns(_mailSenderConfiguration);

            _mailNotificationRepository = Substitute.For<IMailNotificationRepository>();
            _mailSender = Substitute.For<IMailSender>();
            _mailSettings = Substitute.For<MailSettings>(_configurationReader);
            _mailSettings.MailSenderSettings.Returns(_mailSenderConfiguration);

            _mailSenderTask = new MailSenderTask(_mailNotificationRepository, _mailSender, _mailSettings);
        }

        #region Execute

        [TestMethod]
        public void Execute_ShouldNotSendNotification_WhenNoNotificationsFound()
        {
            //Arrange
            _mailNotificationRepository.GetCollection(_mailSenderConfiguration.BatchSize).Returns(new List<MailNotification>());

            //Act
            _mailSenderTask.Execute();

            //Assert
            _mailSender.DidNotReceive().Send(Arg.Any<MailNotification>());
        }

        [TestMethod]
        public void Execute_ShouldSendNotification()
        {
            //Arrange
            var notification = MailNotificationObjectMother.Create();
            _mailNotificationRepository.GetCollection(_mailSenderConfiguration.BatchSize).Returns(new List<MailNotification>() { notification });

            //Act
            _mailSenderTask.Execute();

            //Assert
            _mailSender.Received().Send(notification);
        }

        [TestMethod]
        public void Execute_ShouldRemoveNotificationFromRepository_WhenSuccessfullySent()
        {
            //Arrange
            var notification = MailNotificationObjectMother.Create();
            _mailNotificationRepository.GetCollection(_mailSenderConfiguration.BatchSize).Returns(new List<MailNotification>() { notification });
            _mailSender.Send(notification).Returns(true);

            //Act
            _mailSenderTask.Execute();

            //Assert
            _mailNotificationRepository.Received().Remove(notification);
        }

        [TestMethod]
        public void Execute_ShouldNotRemoveNotificationFromRepository_WhenSendingFails()
        {
            //Arrange
            var notification = MailNotificationObjectMother.Create();
            _mailNotificationRepository.GetCollection(_mailSenderConfiguration.BatchSize).Returns(new List<MailNotification>() { notification });
            _mailSender.Send(notification).Returns(false);

            //Act
            _mailSenderTask.Execute();

            //Assert
            _mailNotificationRepository.DidNotReceive().Remove(notification);
        }

        #endregion
    }
}

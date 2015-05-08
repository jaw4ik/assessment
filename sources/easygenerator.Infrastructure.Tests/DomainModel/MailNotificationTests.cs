using System;
using easygenerator.Infrastructure.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Infrastructure.Tests.DomainModel
{
    [TestClass]
    public class MailNotificationTests
    {
        [TestMethod]
        public void MailNotification_ShoulThrowArgumentNullException_WhenBodyIsNull()
        {
            //Arrange
            Action action = () => MailNotificationObjectMother.CreateWithBody(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("body");
        }

        [TestMethod]
        public void MailNotification_ShoulThrowArgumentException_WhenBodyIsEmpty()
        {
            //Arrange
            Action action = () => MailNotificationObjectMother.CreateWithBody(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("body");
        }

        [TestMethod]
        public void MailNotification_ShoulThrowArgumentNullException_WhenSubjectIsNull()
        {
            //Arrange
            Action action = () => MailNotificationObjectMother.CreateWithSubject(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("subject");
        }

        [TestMethod]
        public void MailNotification_ShoulThrowArgumentException_WhenSubjectIsEmpty()
        {
            //Arrange
            Action action = () => MailNotificationObjectMother.CreateWithSubject(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("subject");
        }

        [TestMethod]
        public void MailNotification_ShoulThrowArgumentNullException_WhenFromAddressesIsNull()
        {
            //Arrange
            Action action = () => MailNotificationObjectMother.CreateWithFromAddress(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("fromEmailAddress");
        }

        [TestMethod]
        public void MailNotification_ShoulThrowArgumentException_WhenFromAddressesIsEmpty()
        {
            //Arrange
            Action action = () => MailNotificationObjectMother.CreateWithFromAddress(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("fromEmailAddress");
        }

        [TestMethod]
        public void MailNotification_ShoulThrowArgumentNullException_WhenToAddressIsNull()
        {
            //Arrange
            Action action = () => MailNotificationObjectMother.CreateWithToAddresses(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("toEmailAddresses");
        }

        [TestMethod]
        public void MailNotification_ShoulThrowArgumentException_WhenToAddressIsEmpty()
        {
            //Arrange
            Action action = () => MailNotificationObjectMother.CreateWithToAddresses(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("toEmailAddresses");
        }


        [TestMethod]
        public void MailNotification_ShouldCreateMailNotification()
        {
            //Arrange
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            var body = "email body";
            var subject = "email subject";
            var fromAddress = "easygenerator@easygenerator.com";
            var toAddresses = "easygenerator2@easygenerator.com";
            var ccEmails = "easygenerator@easygenerator.com;easygenerator2@easygenerator.com";
            var bccEmails = "easygenerator@easygenerator.com;easygenerator2@easygenerator.com";
            //Act
            var mailNotification = MailNotificationObjectMother.Create(body, subject, fromAddress, toAddresses, ccEmails, bccEmails);

            //Assert
            mailNotification.Id.Should().NotBeEmpty();
            mailNotification.CreatedOn.Should().Be(DateTime.MaxValue);
            mailNotification.Body.Should().Be(body);
            mailNotification.Subject.Should().Be(subject);
            mailNotification.FromEmailAddress.Should().Be(fromAddress);
            mailNotification.ToEmailAddresses.Should().Be(toAddresses);
            mailNotification.CCEmailAddresses.Should().Be(ccEmails);
            mailNotification.BCCEmailAddresses.Should().Be(bccEmails);
        }
    }
}

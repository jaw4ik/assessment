using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Slack;
using easygenerator.Web.Domain.DomainEvents.Handlers.Organizaions;
using easygenerator.Web.Domain.DomainEvents.Handlers.Slack;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.Handlers.Slack
{
    [TestClass]
    public class UserEventsHandlerTests
    {
        private UserEventsHandler _handler;
        private SlackClient _slackClient;
        private IUserDomainRepository _userDomainRepository;

        [TestInitialize]
        public void Initialize()
        {
            _slackClient = Substitute.For<SlackClient>();
            _userDomainRepository = Substitute.For<IUserDomainRepository>();
            _handler = Substitute.For<UserEventsHandler>(_slackClient, _userDomainRepository);
        }

        #region Handle UserSignedUpEvent

        [TestMethod]
        public void Handle_UserSignedUpEvent_WhenUserDomainDoesNotExist_ShouldAddDomainToRepository()
        {
            //Arrange
            const string userDomainName = "test.test";
            var user = UserObjectMother.CreateWithEmail("test@" + userDomainName);
            var args = new UserSignedUpEvent(user, "1111111");

            //Act
            _handler.Handle(args);

            //Assert
            _userDomainRepository.Received().Add(Arg.Is<UserDomain>((_) => _.IsObjectSimilarTo(new UserDomain(userDomainName, 1, true))));
        }

        [TestMethod]
        public void Handle_UserSignedUpEvent_ShouldIncreaseUsersNumbery()
        {
            //Arrange
            const string userDomainName = "test.test";

            var user = UserObjectMother.CreateWithEmail("test@" + userDomainName);
            var userDomain = new UserDomain(userDomainName, 0, false);
            var args = new UserSignedUpEvent(user, "1111111");

            _userDomainRepository.Get(userDomainName).Returns(userDomain);

            //Act
            _handler.Handle(args);

            //Assert
            userDomain.NumberOfUsers.Should().Be(1);
        }

        [TestMethod]
        public void Handle_UserSignedUpEvent_WhenDomainIsTrackedAndUsersNumberMoreThan1_ShouldSendSlackNotification()
        {
            //Arrange
            const string userDomainName = "test.test";
            const string userEmail = "test@" + userDomainName;

            var user = UserObjectMother.CreateWithEmail(userEmail);
            var userDomain = new UserDomain(userDomainName, 1, true);
            var args = new UserSignedUpEvent(user, "1111111");

            _userDomainRepository.Get(userDomainName).Returns(userDomain);

            //Act
            _handler.Handle(args);

            //Assert
            _handler.Received().SendMessageToSlack(userEmail, userDomain);
        }

        [TestMethod]
        public void Handle_UserSignedUpEvent_WhenDomainIsNotTracked_ShouldNotSendSlackNotification()
        {
            //Arrange
            const string userDomainName = "test.test";
            const string userEmail = "test@" + userDomainName;

            var user = UserObjectMother.CreateWithEmail(userEmail);
            var userDomain = new UserDomain(userDomainName, 1, false);
            var args = new UserSignedUpEvent(user, "1111111");

            _userDomainRepository.Get(userDomainName).Returns(userDomain);

            //Act
            _handler.Handle(args);

            //Assert
            _handler.DidNotReceive().SendMessageToSlack(userEmail, userDomain);
        }

        [TestMethod]
        public void Handle_UserSignedUpEvent_WhenDomainIsTrackedAndUsersNumberLessThan1_ShouldNotSendSlackNotification()
        {
            //Arrange
            const string userDomainName = "test.test";
            const string userEmail = "test@" + userDomainName;

            var user = UserObjectMother.CreateWithEmail(userEmail);
            var userDomain = new UserDomain(userDomainName, 0, true);
            var args = new UserSignedUpEvent(user, "1111111");

            _userDomainRepository.Get(userDomainName).Returns(userDomain);

            //Act
            _handler.Handle(args);

            //Assert
            _handler.DidNotReceive().SendMessageToSlack(userEmail, userDomain);
        }
        #endregion
    }
}

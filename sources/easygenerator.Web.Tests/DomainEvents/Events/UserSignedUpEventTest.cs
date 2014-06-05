﻿using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.UserEvents;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;

namespace easygenerator.Web.Tests.DomainEvents.Events
{
    [TestClass]
    public class UserSignedUpEventTest
    {
        [TestMethod]
        public void UserSignedUpEvent_ShoulThrowArgumentNullException_WhenUserIsNull()
        {
            //Arrange
            Action action = () => new UserSignedUpEvent(null, "abcABC123", "test", true);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("user");
        }


        [TestMethod]
        public void UserSignedUpEvent_ShouldCreateUserSignedUpEvent()
        {
            //Arrange
            var user = Substitute.For<User>();
            const string courseDevelopersCount = "5";

            var signedUpEvent = new UserSignedUpEvent(user, "abcABC123", courseDevelopersCount, true);

            //Assert
            signedUpEvent.User.Should().Be(user);
            signedUpEvent.CourseDevelopersCount.Should().Be(courseDevelopersCount);
            signedUpEvent.RequestIntroductionDemo.Should().Be(true);
        }
    }
}

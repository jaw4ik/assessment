using System.Activities.Expressions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using easygenerator.DomainModel;
using NSubstitute;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;

namespace easygenerator.Web.Tests.DomainEvents.Events
{
    [TestClass]
    public class UserSignedUpEventTest
    {
        [TestMethod]
        public void UserSignedUpEvent_ShoulThrowArgumentNullException_WhenUserIsNull()
        {
            //Arrange
            Action action = () => new UserSignedUpEvent(null, "abcABC123", "test", "test", "test");

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("user");
        }


        [TestMethod]
        public void UserSignedUpEvent_ShouldCreateUserSignedUpEvent()
        {
            //Arrange
            var user = Substitute.For<User>();
            var courseDevelopersCount = "5";
            var whenNeedAuthoringTool = "Now";
            var usedAuthoringTool = "powerpoint";

            UserSignedUpEvent signedUpEvent = new UserSignedUpEvent(user, "abcABC123", courseDevelopersCount, whenNeedAuthoringTool, usedAuthoringTool);

            //Assert
            signedUpEvent.User.Should().Be(user);
            signedUpEvent.CourseDevelopersCount.Should().Be(courseDevelopersCount);
            signedUpEvent.WhenNeedAuthoringTool.Should().Be(whenNeedAuthoringTool);
            signedUpEvent.UsedAuthoringTool.Should().Be(usedAuthoringTool);
        }
    }
}

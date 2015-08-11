using easygenerator.DomainModel.Entities;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class LtiUserInfoTests
    {
        [TestMethod]
        public void UpdateLtiUserId_ShouldThrowArgumentNullException_WhenLtiUserIdIsNull()
        {
            var info = new LtiUserInfo();

            Action action = () => info.UpdateLtiUserId(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("ltiUserId");
        }

        [TestMethod]
        public void UpdateLtiUserId_ShouldThrowArgumentNullException_WhenLtiUserIdIsEmptyString()
        {
            var info = new LtiUserInfo();

            Action action = () => info.UpdateLtiUserId(" ");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ltiUserId");
        }

        [TestMethod]
        public void UpdateLtiUserId_ShouldUpdateLtiUserId()
        {
            var info = new LtiUserInfo();
            info.UpdateLtiUserId("2");

            info.LtiUserId.Should().Be("2");
        }
    }
}

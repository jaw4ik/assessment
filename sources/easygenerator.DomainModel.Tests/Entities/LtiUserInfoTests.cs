using easygenerator.DomainModel.Entities;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using easygenerator.DomainModel.Tests.ObjectMothers;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class LtiUserInfoTests
    {
        [TestMethod]
        public void Ctor_ShouldThrowArgumentNullException_WhenConsumerToolIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => new LtiUserInfo("id", null, user);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("consumerTool");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentNullException_WhenUserIsNull()
        {
            var consumerTool = new ConsumerTool();

            Action action = () => new LtiUserInfo("id", consumerTool, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("user");
        }

        [TestMethod]
        public void Ctor_ShouldUpdateLtiUserIdAndConsumerToolAndUser()
        {
            var id = "id";
            var consumerTool = new ConsumerTool();
            var user = UserObjectMother.Create();
            var ltiUserInfo = new LtiUserInfo(id, consumerTool, user);

            ltiUserInfo.LtiUserId.Should().Be(id);
            ltiUserInfo.ConsumerTool.Should().Be(consumerTool);
            ltiUserInfo.User.Should().Be(user);
        }

        [TestMethod]
        public void Ctor_ShouldGenerateNotEmptyGuid()
        {
            var id = "id";
            var consumerTool = new ConsumerTool();
            var user = UserObjectMother.Create();

            var ltiUserInfo = new LtiUserInfo(id, consumerTool, user);

            ltiUserInfo.Id.Equals(Guid.Empty).Should().BeFalse();
        }
    }
}

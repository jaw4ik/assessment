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
        public void Ctor_ShouldThrowArgumentNullException_WhenLtiUserIdIsNull()
        {
            Action action = () => new LtiUserInfo(null, new ConsumerTool());

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("ltiUserId");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_WhenLtiUserIdIsEmptyString()
        {
            Action action = () => new LtiUserInfo(" ", new ConsumerTool());

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ltiUserId");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentNullException_WhenConsumerToolIsNull()
        {
            Action action = () => new LtiUserInfo("id", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("consumerTool");
        }

        [TestMethod]
        public void Ctor_ShouldUpdateLtiUserIdAndConsumerTool()
        {
            var id = "id";
            var consumerTool = new ConsumerTool();
            var ltiUserInfo = new LtiUserInfo(id, consumerTool);

            ltiUserInfo.LtiUserId.Should().Be(id);
            ltiUserInfo.ConsumerTool.Should().Be(consumerTool);
        }

        [TestMethod]
        public void Ctor_ShouldGenerateNotEmptyGuid()
        {
            var id = "id";
            var consumerTool = new ConsumerTool();
            var ltiUserInfo = new LtiUserInfo(id, consumerTool);

            ltiUserInfo.Id.Equals(Guid.Empty).Should().BeFalse();
        }
    }
}

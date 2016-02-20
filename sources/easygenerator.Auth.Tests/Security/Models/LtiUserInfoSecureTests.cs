using easygenerator.Auth.Security.Models;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Auth.Tests.Security.Models
{
    [TestClass]
    public class LtiUserInfoSecureTests
    {
        private LtiUserInfo _ltiUserInfo;

        [TestInitialize]
        public void Initialize()
        {
            _ltiUserInfo = LtiUserInfoObjectMother.Create();
        }

        #region Constructor

        [TestMethod]
        public void LtiUserInfoSecure_ShouldSetAllFieldsToGivenValues()
        {
            var ltiUserInfoSecure = new LtiUserInfoSecure(_ltiUserInfo);

            ltiUserInfoSecure.LtiUserId.Should().Be(_ltiUserInfo.LtiUserId);
            ltiUserInfoSecure.ConsumerToolId.Should().Be(_ltiUserInfo.ConsumerTool_Id);
            ltiUserInfoSecure.UserId.Should().Be(_ltiUserInfo.User_Id);
        }

        #endregion
    }
}

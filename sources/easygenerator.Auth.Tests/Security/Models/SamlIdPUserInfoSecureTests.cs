using easygenerator.Auth.Security.Models;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Auth.Tests.Security.Models
{
    [TestClass]
    public class SamlIdPUserInfoSecureTests
    {
        private SamlIdPUserInfo _samlIdPUserInfo;

        [TestInitialize]
        public void Initialize()
        {
            _samlIdPUserInfo = SamlIdPUserInfoObjectMother.Create();
        }

        #region Constructor

        [TestMethod]
        public void SamlIdPUserInfoSecure_ShouldSetAllFieldsToGivenValues()
        {
            var samlIdPUserInfoSecure = new SamlIdPUserInfoSecure(_samlIdPUserInfo);
            
            samlIdPUserInfoSecure.SamlIdPId.Should().Be(_samlIdPUserInfo.SamlIdP_Id);
            samlIdPUserInfoSecure.UserId.Should().Be(_samlIdPUserInfo.User_Id);
        }

        #endregion
    }
}

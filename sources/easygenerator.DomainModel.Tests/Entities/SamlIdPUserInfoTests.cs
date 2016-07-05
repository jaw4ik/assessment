using easygenerator.DomainModel.Entities;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using easygenerator.DomainModel.Tests.ObjectMothers;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class SamlIdPUserInfoTests
    {
        [TestMethod]
        public void Ctor_ShouldThrowArgumentNullException_WhenSamlIdentityProviderIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => new SamlIdPUserInfo(null, user);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("samlIdP");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentNullException_WhenUserIsNull()
        {
            var samlIdentityProvider = new SamlIdentityProvider();

            Action action = () => new SamlIdPUserInfo(samlIdentityProvider, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("user");
        }

        [TestMethod]
        public void Ctor_ShouldUpdateSamlIdentityProviderAndUser()
        {
            var samlIdentityProvider = new SamlIdentityProvider();
            var user = UserObjectMother.Create();
            var samlIdPUserInfo = new SamlIdPUserInfo(samlIdentityProvider, user);
            
            samlIdPUserInfo.SamlIdP.Should().Be(samlIdentityProvider);
            samlIdPUserInfo.User.Should().Be(user);
        }

        [TestMethod]
        public void Ctor_ShouldGenerateNotEmptyGuid()
        {
            var samlIdentityProvider = new SamlIdentityProvider();
            var user = UserObjectMother.Create();

            var samlIdPUserInfo = new SamlIdPUserInfo(samlIdentityProvider, user);

            samlIdPUserInfo.Id.Equals(Guid.Empty).Should().BeFalse();
        }
    }
}
